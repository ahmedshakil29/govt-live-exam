import Link from "next/link";
import { t } from "@/lib/exam-text";
import { formatMarks } from "@/lib/exam-score";
import type { Exam } from "@/lib/exam-types";

type Props = {
  exam: Exam;
  onStart: () => void;
};

/** Phase 1: everything the student should know before starting. */
export default function ExamInfo({ exam, onStart }: Props) {
  const fullMarks = exam.questions.length * exam.marksPerQuestion;

  const rows: [string, string][] = [
    [t.totalQuestions, String(exam.questions.length)],
    [t.time, `${formatMarks(exam.duration)} ${t.minutes}`],
    [t.marksPerQuestion, formatMarks(exam.marksPerQuestion)],
    [t.negativeMarking, exam.negativeMarking > 0 ? formatMarks(exam.negativeMarking) : t.none],
    [t.fullMarks, formatMarks(fullMarks)],
  ];
  if (exam.cutMark !== undefined) rows.push([t.cutMark, formatMarks(exam.cutMark)]);

  const instructions = exam.instructions.length > 0 ? exam.instructions : t.defaultInstructions;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
      <Link href="/live-exam" className="text-sm text-soft hover:text-ink">
        {t.allExams}
      </Link>
      <h1 className="mt-3 text-3xl font-semibold leading-snug tracking-tight text-ink">{exam.title}</h1>
      {exam.description && <p className="mt-2 text-lg leading-relaxed text-soft">{exam.description}</p>}

      <section className="mt-8 border-t-2 border-ink pt-1">
        <dl className="divide-y divide-rule">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-soft">{label}</dt>
              <dd className="font-semibold tabular-nums text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {exam.subjects.length > 1 && (
        <section className="mt-8 border-t-2 border-ink pt-3">
          <h2 className="text-lg font-semibold text-ink">{t.subjectsAndQuestions}</h2>
          <dl className="mt-1 divide-y divide-rule">
            {exam.subjects.map((s) => (
              <div key={s.name} className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-ink">{s.name}</dt>
                <dd className="tabular-nums text-soft">{s.count}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="mt-8 border-t-2 border-ink pt-3">
        <h2 className="text-lg font-semibold text-ink">{t.instructions}</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-6 leading-relaxed text-ink">
          {instructions.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </section>

      <button
        type="button"
        onClick={onStart}
        className="mt-10 w-full rounded-md bg-ink px-6 py-3.5 text-base font-semibold text-paper hover:opacity-90 sm:w-auto"
      >
        {t.startExam}
      </button>
    </div>
  );
}
