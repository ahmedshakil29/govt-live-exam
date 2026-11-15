import { cn } from "@/lib/utils";
import { t } from "@/lib/exam-text";
import { formatMarks, type ExamResultData } from "@/lib/exam-score";

export default function MarkSheet({ result }: { result: ExamResultData }) {
  const heads = [t.subject, t.correct, t.wrong, t.marks];
  const cell = "px-4 py-4";
  const divider = "border-l border-rule";

  return (
    <section className="mt-10">
      <h2 className="flex items-center justify-center gap-3 text-xl font-semibold text-ink">
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="9.5" />
          <path d="M7.5 12.5l3 3 6-7" />
        </svg>
        {t.markSheet}
      </h2>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-rule bg-surface">
        <table className="w-full min-w-[22rem] border-collapse text-left">
          <thead>
            <tr className="bg-ink/5">
              {heads.map((h, i) => (
                <th key={h} scope="col" className={cn(cell, "font-medium text-ink", i > 0 && divider)}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {result.subjects.map((s) => (
              <tr key={s.subject} className="border-t border-rule">
                <th scope="row" className={cn(cell, "font-normal text-ink")}>{s.subject}</th>
                <td className={cn(cell, divider)}>{s.correct}</td>
                <td className={cn(cell, divider)}>{s.wrong}</td>
                <td className={cn(cell, divider)}>{formatMarks(s.marks)}</td>
              </tr>
            ))}
            <tr className="border-t border-rule font-bold text-ink">
              <th scope="row" className={cell}>{t.total}</th>
              <td className={cn(cell, divider)}>{result.totals.correct}</td>
              <td className={cn(cell, divider)}>{result.totals.wrong}</td>
              <td className={cn(cell, divider)}>{formatMarks(result.totals.marks)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-sm text-soft">
        {t.skipped}: {result.totals.skipped}
      </p>
    </section>
  );
}
