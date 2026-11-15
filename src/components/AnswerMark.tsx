type Props = {
  kind: "right" | "wrong";
  /** Read out by screen readers, since the icon has no text. */
  label: string;
};

/** Circled tick (right answer) or circled cross (your wrong answer). */
export default function AnswerMark({ kind, label }: Props) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      className="size-6 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9.5" />
      {kind === "right" ? <path d="M7.5 12.5l3 3 6-7" /> : <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" />}
    </svg>
  );
}
