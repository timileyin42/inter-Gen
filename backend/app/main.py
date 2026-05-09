"""FastAPI application and routes for InterviewGenie."""

import logging
from datetime import UTC, datetime

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.llm import (
    LLMMalformedError,
    LLMRateLimitError,
    LLMTimeoutError,
    LLMUpstreamError,
    generate_interview_questions,
)
from app.rate_limit import RateLimitExceededError, rate_limiter
from app.schemas import GenerateRequest, GenerateResponse, HealthResponse

logger = logging.getLogger("interview_genie")

app = FastAPI(title="InterviewGenie API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _request: Request, _exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=400,
        content={"detail": "Use a job title between 2 and 100 characters."},
    )


@app.get("/api/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/api/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest, request: Request) -> GenerateResponse:
    try:
        rate_limiter.check(_client_key(request))
    except RateLimitExceededError as exc:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please wait a minute and try again.",
        ) from exc

    try:
        questions = await generate_interview_questions(req.job_title)
    except LLMTimeoutError as exc:
        logger.warning("llm_timeout")
        raise HTTPException(
            status_code=504,
            detail="Generation took too long. Please try again.",
        ) from exc
    except LLMRateLimitError as exc:
        logger.warning("llm_rate_limited")
        raise HTTPException(
            status_code=429,
            detail="The AI service is busy. Please try again soon.",
        ) from exc
    except LLMUpstreamError as exc:
        logger.warning("llm_upstream_error")
        raise HTTPException(
            status_code=502,
            detail="AI service is unavailable. Please try again.",
        ) from exc
    except LLMMalformedError as exc:
        logger.warning("llm_malformed_response")
        raise HTTPException(
            status_code=502,
            detail="Got an unexpected AI response. Please try again.",
        ) from exc

    if settings.log_user_input:
        logger.info(
            "generated_questions_for_job_title",
            extra={"job_title": req.job_title},
        )
    else:
        logger.info("generated_questions")

    return GenerateResponse(
        job_title=req.job_title,
        questions=questions,
        model=settings.gemini_model,
        generated_at=datetime.now(UTC),
    )


def _client_key(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",", maxsplit=1)[0].strip()
    if request.client:
        return request.client.host
    return "unknown"
