export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-[800px]">
      <div className="h-3 w-52 shimmer rounded-full mb-5 ml-1" />
      <div className="flex flex-col gap-3">
        {[75, 55, 68].map((pct, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1A1A24] rounded-xl border border-slate-200 dark:border-white/8 p-6 shadow-sm flex items-start gap-4"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full shimmer" />
            <div className="flex-grow flex flex-col gap-2.5 pt-1">
              <div className="h-3.5 shimmer rounded-full" style={{ width: `${pct}%` }} />
              <div className="h-3.5 shimmer rounded-full" style={{ width: `${pct - 18}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
