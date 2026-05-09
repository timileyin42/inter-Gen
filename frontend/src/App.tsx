import { useState, useEffect } from "react";
import GeneratorCard from "./components/GeneratorCard";
import QuestionList from "./components/QuestionList";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { generateQuestions } from "./lib/api";

type Status = "idle" | "loading" | "success" | "error";

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [questions, setQuestions] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastRole, setLastRole] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  async function handleGenerate() {
    const trimmed = jobTitle.trim();
    if (trimmed.length < 2) return;

    setStatus("loading");
    setQuestions([]);
    setErrorMsg(null);
    setLastRole(trimmed);

    try {
      const result = await generateQuestions(trimmed);
      setQuestions(result);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB] dark:bg-[#141218] font-sans antialiased relative overflow-x-hidden">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#6750a4]/10 dark:bg-[#6750a4]/15 blur-[120px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#6750a4]/5 dark:bg-[#6750a4]/8 blur-[100px] translate-y-1/3 -translate-x-1/4" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAFAFB]/80 dark:bg-[#141218]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-white/8">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1200px] mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-[#6750a4] text-xl">✦</span>
            <span className="text-[20px] font-bold tracking-tight text-slate-900 dark:text-[#e6e0e9]">
              InterviewGenie
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex gap-6 items-center">
            <a
              href="https://github.com/timileyin42/inter-Gen"
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-medium text-slate-500 dark:text-[#cbc4d2] hover:text-[#6750a4] dark:hover:text-[#cfbcff] transition-colors"
            >
              GitHub
            </a>
            <a href="#" className="text-[13px] font-medium text-slate-500 dark:text-[#cbc4d2] hover:text-[#6750a4] dark:hover:text-[#cfbcff] transition-colors">
              About
            </a>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle dark mode"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-[#cbc4d2] hover:bg-slate-100 dark:hover:bg-[#211f24] border border-slate-200 dark:border-white/10 transition-all duration-150"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            <a
              href="#"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-[13px] font-semibold text-white btn-gradient hover:-translate-y-[1px] hover:shadow-[0_4px_14px_-2px_rgba(103,80,164,0.4)] transition-all duration-150"
            >
              Sign In
            </a>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-grow flex flex-col items-center pt-16 pb-24 px-4 max-w-[1200px] mx-auto w-full">

        {/* Hero */}
        <div className="text-center mb-10 max-w-[700px]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#211f24] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-[#cbc4d2] text-[13px] font-medium mb-6 shadow-sm">
            <span>✨</span> Powered by Gemini
          </div>

          <h1 className="text-[48px] sm:text-[58px] font-bold tracking-tight leading-[1.08] mb-4 text-slate-900 dark:text-[#e6e0e9]">
            Better interview questions,{" "}
            <span className="gradient-text">in seconds.</span>
          </h1>

          <p className="text-[16px] text-slate-500 dark:text-[#cbc4d2] max-w-[420px] mx-auto leading-relaxed">
            Tell me a role. I'll bring the questions.
          </p>
        </div>

        {/* Generator card */}
        <GeneratorCard
          jobTitle={jobTitle}
          loading={status === "loading"}
          onChange={setJobTitle}
          onSubmit={handleGenerate}
        />

        {/* Results */}
        {status !== "idle" && (
          <div className="mt-10 w-full flex flex-col items-center">

            {status === "loading" && <LoadingSkeleton />}

            {status === "error" && errorMsg && (
              <div className="w-full max-w-[800px] flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl px-5 py-4 text-red-700 dark:text-red-400">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="flex-grow text-[14px] font-medium">{errorMsg}</p>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="text-[13px] font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity flex-shrink-0"
                >
                  Retry
                </button>
              </div>
            )}

            {status === "success" && questions.length > 0 && (
              <QuestionList jobTitle={lastRole} questions={questions} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white dark:bg-[#0f0d13] border-t border-slate-200 dark:border-white/8 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-6 max-w-[1200px] mx-auto gap-3 md:gap-0">
          <p className="text-[13px] text-slate-500 dark:text-[#494551] font-medium">
            Built with FastAPI, React &amp; Gemini
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[13px] text-slate-400 dark:text-[#494551] hover:text-slate-700 dark:hover:text-[#cbc4d2] transition-colors">
              Privacy Policy
            </a>
            <span className="text-slate-200 dark:text-white/10">|</span>
            <span className="text-[11px] font-mono text-slate-400 dark:text-[#494551] border border-slate-200 dark:border-white/10 rounded px-2 py-0.5 bg-slate-50 dark:bg-[#141218]">
              v1.0
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
