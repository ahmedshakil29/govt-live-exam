"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/exam-text";
import QuestionCard from "./QuestionCard";
import type { Exam } from "@/lib/exam-types";
import type { Verdict } from "@/lib/exam-score";

type Filter = "all" | "wrong" | "skipped";

type Props = {
  exam: Exam;
  answers: number[];
  verdicts: Verdict[];
};

export default function QuestionReview({ exam, answers, verdicts }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const count = (v: Verdict) => verdicts.filter((x) => x === v).length;
  const filters: { id: Filter; label: string; n: number }[] = [
    { id: "all", label: t.filterAll, n: verdicts.length },
    { id: "wrong", label: t.filterWrong, n: count("wrong") },
    { id: "skipped", label: t.filterSkipped, n: count("skipped") },
  ];

  const items = exam.questions
    .map((question, i) => ({ question, i }))
    .filter(({ i }) => filter === "all" || verdicts[i] === filter);

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-ink">{t.review}</h2>

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={t.review}>
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm",
              filter === f.id ? "border-ink bg-ink text-paper" : "border-rule text-soft hover:text-ink",
            )}
          >
            {f.label} ({f.n})
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {items.length === 0 && <p className="py-8 text-center text-soft">{t.nothingHere}</p>}
        {items.map(({ question, i }) => (
          <QuestionCard key={i} mode="review" index={i} question={question} picked={answers[i] ?? -1} />
        ))}
      </div>
    </section>
  );
}
