"""Small in-memory rate limiter for the MVP API."""

from collections import defaultdict
from time import monotonic


class RateLimitExceededError(Exception):
    """Raised when a client exceeds the configured request limit."""


class InMemoryRateLimiter:
    def __init__(self, limit: int, window_seconds: int) -> None:
        self.limit = limit
        self.window_seconds = window_seconds
        self._requests: dict[str, list[float]] = defaultdict(list)

    def check(self, key: str) -> None:
        now = monotonic()
        window_start = now - self.window_seconds
        recent = [
            timestamp
            for timestamp in self._requests[key]
            if timestamp >= window_start
        ]

        if len(recent) >= self.limit:
            self._requests[key] = recent
            raise RateLimitExceededError

        recent.append(now)
        self._requests[key] = recent


rate_limiter = InMemoryRateLimiter(limit=20, window_seconds=60)
