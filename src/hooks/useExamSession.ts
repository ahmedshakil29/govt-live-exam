"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Phase = "info" | "exam" | "result";

export type Session = {
  phase: Phase;
  startedAt: number | null;
  finishedAt: number | null;
  /** One entry per question: the chosen option, or -1 when unanswered. */
  answers: number[];
};

const PREFIX = "study-desk:exam:";
const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; value: Session }>();

const SERVER_SESSION: Session = { phase: "info", startedAt: null, finishedAt: null, answers: [] };

const blank = (total: number): Session => ({
  phase: "info",
  startedAt: null,
  finishedAt: null,
  answers: Array<number>(total).fill(-1),
});

const notify = () => listeners.forEach((l) => l());

function read(slug: string, total: number): Session {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(PREFIX + slug);
  } catch {
    // storage blocked: fall back to the in-memory copy below
  }

  const hit = cache.get(slug);
  if (hit && hit.raw === raw) return hit.value;

  let value = blank(total);
  if (raw) {
    try {
      const p = JSON.parse(raw);
      const okPhase = p.phase === "info" || p.phase === "exam" || p.phase === "result";
      // If the exam was edited and now has a different number of questions, start fresh.
      if (okPhase && Array.isArray(p.answers) && p.answers.length === total) {
        value = {
          phase: p.phase,
          startedAt: typeof p.startedAt === "number" ? p.startedAt : null,
          finishedAt: typeof p.finishedAt === "number" ? p.finishedAt : null,
          answers: p.answers,
        };
      }
    } catch {
      // corrupted entry: ignore it
    }
  }
  cache.set(slug, { raw, value });
  return value;
}

function write(slug: string, session: Session) {
  const raw = JSON.stringify(session);
  try {
    localStorage.setItem(PREFIX + slug, raw);
    cache.set(slug, { raw, value: session });
  } catch {
    cache.set(slug, { raw: null, value: session });
  }
  notify();
}

function clear(slug: string, total: number) {
  try {
    localStorage.removeItem(PREFIX + slug);
  } catch {
    // ignore
  }
  cache.set(slug, { raw: null, value: blank(total) });
  notify();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * The three phases of one exam (info, exam, result), saved in this browser.
 * Refreshing the page keeps your answers and the running clock.
 */
export function useExamSession(slug: string, total: number) {
  const session = useSyncExternalStore(subscribe, () => read(slug, total), () => SERVER_SESSION);

  const start = useCallback(() => {
    write(slug, { ...blank(total), phase: "exam", startedAt: Date.now() });
  }, [slug, total]);

  const answer = useCallback(
    (index: number, choice: number) => {
      const current = read(slug, total);
      if (current.phase !== "exam") return;
      const answers = [...current.answers];
      answers[index] = choice;
      write(slug, { ...current, answers });
    },
    [slug, total],
  );

  const submit = useCallback(() => {
    const current = read(slug, total);
    if (current.phase !== "exam") return;
    write(slug, { ...current, phase: "result", finishedAt: Date.now() });
  }, [slug, total]);

  /** Go back to the info page and forget this attempt. */
  const leave = useCallback(() => clear(slug, total), [slug, total]);

  return { session, start, answer, submit, leave };
}
