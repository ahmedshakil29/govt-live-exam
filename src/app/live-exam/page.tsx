import type { Metadata } from "next";
import ExamListItem from "@/components/ExamListItem";
import { getExamSummaries } from "@/lib/exam";
import { t } from "@/lib/exam-text";

export const metadata: Metadata = { title: "Live exam" };

export default function LiveExamPage() {
  const exams = getExamSummaries();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">{t.examsTitle}</h1>
      <p className="mt-2 text-lg text-soft">{t.examsIntro}</p>

      {exams.length === 0 ? (
        <p className="mt-10 text-soft">
          No exams yet. Add a .json file to the <code className="rounded bg-ink/5 px-1 font-mono text-sm">exams</code>{" "}
          folder (copy <code className="rounded bg-ink/5 px-1 font-mono text-sm">_template.json</code>).
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-rule border-t-2 border-ink">
          {exams.map((exam) => (
            <ExamListItem key={exam.slug} exam={exam} />
          ))}
        </ul>
      )}
    </div>
  );
}
