# InterviewGenie Backend

FastAPI service for generating interview questions with Gemini.

## Run Locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Set `GEMINI_API_KEY` in `.env` before calling `/api/generate`.

## Test

```bash
pytest -q
ruff check .
ruff format --check .
```
