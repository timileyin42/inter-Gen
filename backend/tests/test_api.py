"""API tests for the InterviewGenie backend."""

from fastapi.testclient import TestClient

from app.llm import (
    LLMMalformedError,
    LLMRateLimitError,
    LLMTimeoutError,
    LLMUpstreamError,
)
from app.main import app
from app.rate_limit import rate_limiter

client = TestClient(app)


def setup_function() -> None:
    rate_limiter._requests.clear()


def test_health() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_generate_rejects_empty() -> None:
    response = client.post("/api/generate", json={"job_title": ""})

    assert response.status_code == 400


def test_generate_rejects_whitespace() -> None:
    response = client.post("/api/generate", json={"job_title": "   "})

    assert response.status_code == 400


def test_generate_rejects_too_long() -> None:
    response = client.post("/api/generate", json={"job_title": "x" * 101})

    assert response.status_code == 400


def test_generate_rejects_control_characters() -> None:
    response = client.post("/api/generate", json={"job_title": "Sales\nManager"})

    assert response.status_code == 400


def test_generate_happy_path(monkeypatch) -> None:
    async def fake_generate(_job_title: str) -> list[str]:
        return ["Q1?", "Q2?", "Q3?"]

    monkeypatch.setattr("app.main.generate_interview_questions", fake_generate)

    response = client.post(
        "/api/generate", json={"job_title": " Customer Success Manager "}
    )

    assert response.status_code == 200
    body = response.json()
    assert body["job_title"] == "Customer Success Manager"
    assert body["questions"] == ["Q1?", "Q2?", "Q3?"]
    assert body["model"] == "gemini-2.5-flash"
    assert "generated_at" in body


def test_generate_maps_timeout(monkeypatch) -> None:
    async def fake_generate(_job_title: str) -> list[str]:
        raise LLMTimeoutError

    monkeypatch.setattr("app.main.generate_interview_questions", fake_generate)

    response = client.post("/api/generate", json={"job_title": "Product Designer"})

    assert response.status_code == 504


def test_generate_maps_upstream_error(monkeypatch) -> None:
    async def fake_generate(_job_title: str) -> list[str]:
        raise LLMUpstreamError

    monkeypatch.setattr("app.main.generate_interview_questions", fake_generate)

    response = client.post("/api/generate", json={"job_title": "Product Designer"})

    assert response.status_code == 502


def test_generate_maps_malformed_error(monkeypatch) -> None:
    async def fake_generate(_job_title: str) -> list[str]:
        raise LLMMalformedError

    monkeypatch.setattr("app.main.generate_interview_questions", fake_generate)

    response = client.post("/api/generate", json={"job_title": "Product Designer"})

    assert response.status_code == 502


def test_generate_maps_llm_rate_limit(monkeypatch) -> None:
    async def fake_generate(_job_title: str) -> list[str]:
        raise LLMRateLimitError

    monkeypatch.setattr("app.main.generate_interview_questions", fake_generate)

    response = client.post("/api/generate", json={"job_title": "Product Designer"})

    assert response.status_code == 429


def test_generate_applies_rate_limit(monkeypatch) -> None:
    async def fake_generate(_job_title: str) -> list[str]:
        return ["Q1?", "Q2?", "Q3?"]

    monkeypatch.setattr("app.main.generate_interview_questions", fake_generate)

    for _ in range(20):
        response = client.post("/api/generate", json={"job_title": "Recruiter"})
        assert response.status_code == 200

    response = client.post("/api/generate", json={"job_title": "Recruiter"})

    assert response.status_code == 429
