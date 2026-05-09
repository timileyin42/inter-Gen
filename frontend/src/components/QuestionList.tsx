import { useState } from "react";

function CopyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function QuestionCard({ index, question }: { index: number; question: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(question);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div
      className="bg-white dark:bg-[#1A1A24] rounded-xl border border-slate-200 dark:border-white/8 p-6 shadow-sm dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] hover:shadow-md dark:hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.5)] transition-all duration-200 flex items-start gap-4 group animate-fade-up"
      style={{ animationDelay: `${index * 90}ms`, animationFillMode: "both", opacity: 0 }}
    >
      {/* Number badge */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full badge-gradient flex items-center justify-center text-white font-bold text-sm shadow-md">
        {index + 1}
      </div>

      <p className="flex-grow text-[15px] text-slate-800 dark:text-[#e6e0e9] leading-relaxed font-medium">
        {question}
      </p>

      <button
        type="button"
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy question"}
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-[#494551] hover:text-[#6750a4] dark:hover:text-[#cfbcff] hover:bg-slate-100 dark:hover:bg-[#211f24] border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all duration-150"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}

interface Props {
  jobTitle: string;
  questions: string[];
}

export default function QuestionList({ jobTitle, questions }: Props) {
  return (
    <div className="w-full max-w-[800px]">
      <p className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-[#494551] uppercase mb-4 pl-1">
        Interview questions for {jobTitle}
      </p>
      <div className="flex flex-col gap-3">
        {questions.map((q, i) => (
          <QuestionCard key={i} index={i} question={q} />
        ))}
      </div>
    </div>
  );
}
