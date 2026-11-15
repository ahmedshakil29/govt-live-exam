"use client";

import { useEffect } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({ title, children, confirmLabel, cancelLabel, onConfirm, onCancel }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center px-4" role="alertdialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-ink/50" onClick={onCancel} aria-hidden />
      <div className="relative w-full max-w-sm rounded-lg border border-rule bg-surface p-5 shadow-xl">
        <h2 className="text-lg font-semibold leading-snug text-ink">{title}</h2>
        <div className="mt-2 space-y-1 text-soft">{children}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="rounded-md border border-rule px-4 py-2 text-sm text-ink hover:bg-ink/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-paper hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
