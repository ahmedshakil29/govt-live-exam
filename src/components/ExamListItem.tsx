import Link from "next/link";
import { t } from "@/lib/exam-text";
import { formatMarks } from "@/lib/exam-score";
import type { ExamSummary } from "@/lib/exam-types";

export default function ExamListItem({ exam }: { exam: ExamSummary }) {
  return (
    <li>
      <Link href={`/live-exam/${exam.slug}`} className="block py-4 hover:bg-ink/5 sm:px-3">
        <span className="block text-lg font-semibold leading-snug text-ink">{exam.title}</span>
        {exam.description && <span className="mt-0.5 block text-soft">{exam.description}</span>}
        <span className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-soft">
          <span>
            {exam.questionCount} {t.questions}
          </span>
          <span>
            {formatMarks(exam.duration)} {t.minutes}
          </span>
          <span>
            {t.fullMarks} {formatMarks(exam.fullMarks)}
          </span>
        </span>
      </Link>
    </li>
  );
}
