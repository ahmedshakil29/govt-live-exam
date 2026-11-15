import { cn } from "@/lib/utils";
import { t } from "@/lib/exam-text";
import AnswerMark from "./AnswerMark";
import type { Question } from "@/lib/exam-types";

type Props = {
  index: number;
  question: Question;
  /** Chosen option, or -1 when unanswered. */
  picked: number;
} & (
  | { mode: "exam"; onPick: (choice: number) => void; onClear: () => void }
  | { mode: "review" }
);

export default function QuestionCard(props: Props) {
  const { index, question, picked } = props;
  const review = props.mode === "review";
  const verdict = picked < 0 ? "skipped" : picked === question.answer ? "correct" : "wrong";

  return (
    <section id={`q-${index}`} className="scroll-mt-44 rounded-lg border border-rule bg-surface p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <h3 className="flex-1 text-base font-semibold leading-relaxed text-ink">
          {index + 1}. {question.q}
        </h3>
        {review && (
          <span
            className={cn(
              "shrink-0 rounded px-2 py-0.5 text-xs font-medium",
              verdict === "correct" && "bg-ok-bg text-ok-ink",
              verdict === "wrong" && "bg-bad-bg text-bad-ink",
              verdict === "skipped" && "bg-ink/10 text-soft",
            )}
          >
            {t[verdict]}
          </span>
        )}
      </div>

      <div className="mt-3 space-y-2" role={review ? undefined : "radiogroup"}>
        {question.options.map((option, j) => {
          if (props.mode === "exam") {
            const selected = picked === j;
            return (
              <label
                key={j}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2 leading-relaxed",
                  selected ? "border-accent bg-accent/10 text-ink" : "border-rule text-ink hover:bg-ink/5",
                )}
              >
                <input
                  type="radio"
                  name={`q${index}`}
                  checked={selected}
                  onChange={() => props.onPick(j)}
                  className="mt-2 accent-accent"
                />
                <span>{option}</span>
              </label>
            );
          }

          const isRight = j === question.answer;
          const isPicked = j === picked;
          // Tick only when an answer was given; an unanswered question just highlights the right option.
          const showTick = isRight && picked >= 0;
          const showCross = isPicked && !isRight;
          return (
            <div
              key={j}
              className={cn(
                "flex items-center gap-3 rounded-md border px-3 py-2 leading-relaxed",
                isRight
                  ? "border-ok bg-ok-bg font-medium text-ok-ink"
                  : isPicked
                    ? "border-bad bg-bad-bg font-medium text-bad-ink"
                    : "border-rule text-soft",
              )}
            >
              <span>{option}</span>
              {showTick && (
                <span className="ml-auto">
                  <AnswerMark kind="right" label={t.correctAnswer} />
                </span>
              )}
              {showCross && (
                <span className="ml-auto">
                  <AnswerMark kind="wrong" label={t.yourWrongAnswer} />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {props.mode === "exam" && picked >= 0 && (
        <button
          type="button"
          onClick={props.onClear}
          className="mt-2 text-sm text-soft underline underline-offset-2 hover:text-ink"
        >
          {t.clearAnswer}
        </button>
      )}

      {review && question.explanation && (
        <div className="mt-3 rounded-md bg-ink/5 px-3.5 py-3 text-sm leading-relaxed">
          <p className="font-semibold text-ink">{t.explanation}</p>
          <p className="mt-0.5 text-soft">{question.explanation}</p>
        </div>
      )}
    </section>
  );
}
