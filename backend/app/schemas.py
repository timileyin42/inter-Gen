"""Pydantic request and response models for the API."""

from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class HealthResponse(BaseModel):
    status: str


class GenerateRequest(BaseModel):
    job_title: str = Field(..., min_length=2, max_length=100)

    @field_validator("job_title")
    @classmethod
    def strip_and_check(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("job_title cannot be empty or whitespace")
        if any(ord(char) < 32 or ord(char) == 127 for char in normalized):
            raise ValueError("job_title cannot contain control characters")
        return normalized


class GenerateResponse(BaseModel):
    job_title: str
    questions: list[str] = Field(..., min_length=3, max_length=3)
    model: str
    generated_at: datetime
