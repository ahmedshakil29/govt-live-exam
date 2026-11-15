import { cn } from "@/lib/utils";
import { t } from "@/lib/exam-text";
import { formatClock, formatMarks, type ExamResultData } from "@/lib/exam-score";

type Props = {
  result: ExamResultData;
  cutMark?: number;
  usedMs: number;
};

export default function ResultCards({ result, cutMark, usedMs }: Props) {
  const { totals, passed, fullMarks } = result;

  const cards = [
    { label: t.correct, value: String(totals.correct), tint: "bg-tint-green" },
    { label: t.wrong, value: String(totals.wrong), tint: "bg-tint-red" },
    { label: t.cutMark, value: cutMark === undefined ? t.notAvailable : formatMarks(cutMark), tint: "bg-tint-blue" },
    { label: t.yourMarks, value: formatMarks(totals.marks), note: `/ ${formatMarks(fullMarks)}`, tint: "bg-tint-blue" },
    {
      label: t.yourResult,
      value: passed === null ? t.notAvailable : passed ? t.passed : t.failed,
      tint: "bg-tint-yellow",
    },
    { label: t.timeUsed, value: formatClock(usedMs), tint: "bg-tint-green" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div key={card.label} className={cn("rounded-md px-3 py-5 text-center text-ink", card.tint)}>
          <p className="text-base">{card.label}</p>
          <p className="mt-1 text-2xl font-medium tabular-nums">
            {card.value}
            {card.note && <span className="ml-1 text-sm font-normal text-soft">{card.note}</span>}
          </p>
        </div>
      ))}
    </div>
  );
}
