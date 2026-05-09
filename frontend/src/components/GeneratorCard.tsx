import { useRef, useEffect } from "react";

const EXAMPLE_ROLES = [
  "Customer Success Manager",
  "Senior Software Engineer",
  "Product Designer",
];

interface Props {
  jobTitle: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function GeneratorCard({ jobTitle, loading, onChange, onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (canSubmit) onSubmit();
    }
  }

  const canSubmit = jobTitle.trim().length >= 2 && !loading;

  return (
    <div className="w-full max-w-[640px] bg-white dark:bg-[#1A1A24] rounded-[24px] border border-slate-200 dark:border-white/10 p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.07)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      {/* Ambient corner glow */}
      <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[#6750a4]/5 dark:bg-[#6750a4]/10 blur-3xl pointer-events-none" />

      {/* Input */}
      <div className="mb-5 relative">
        <input
          ref={inputRef}
          type="text"
          value={jobTitle}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={100}
          placeholder="e.g. Customer Success Manager"
          disabled={loading}
          className="w-full h-[60px] pl-4 pr-24 bg-white dark:bg-[#211f24] border border-slate-200 dark:border-white/10 rounded-xl text-[16px] text-slate-800 dark:text-[#e6e0e9] focus:outline-none focus:ring-4 focus:ring-[#6750a4]/15 focus:border-[#6750a4] transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-[#494551] disabled:opacity-60"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-slate-400 dark:text-[#494551] font-mono text-[11px] border border-slate-200 dark:border-white/10 rounded px-2 py-1 bg-slate-50 dark:bg-[#141218] select-none">
          <span>⌘</span><span>↵</span>
        </div>
      </div>

      {/* Example chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {EXAMPLE_ROLES.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            disabled={loading}
            className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#211f24] text-slate-600 dark:text-[#cbc4d2] text-[13px] font-medium hover:bg-slate-200 dark:hover:bg-[#2b292f] border border-slate-200 dark:border-white/10 transition-all duration-150 disabled:opacity-50"
          >
            {role}
          </button>
        ))}
      </div>

      {/* Generate button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-full h-14 btn-gradient text-white rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 hover:-translate-y-[2px] hover:shadow-[0_8px_25px_-5px_rgba(103,80,164,0.45)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating…
          </>
        ) : (
          <>
            <span className="text-base">✨</span> Generate Questions
          </>
        )}
      </button>
    </div>
  );
}
