const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface GenerateResponse {
  job_title: string;
  questions: string[];
  model: string;
  generated_at: string;
}

export async function generateQuestions(jobTitle: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_title: jobTitle }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail: string =
      typeof body.detail === "string"
        ? body.detail
        : res.status === 504
          ? "Took too long. Please try again."
          : res.status === 429
            ? "Too many requests. Wait a moment and try again."
            : "Something went wrong. Please try again.";
    throw new Error(detail);
  }

  const data: GenerateResponse = await res.json();
  return data.questions;
}
