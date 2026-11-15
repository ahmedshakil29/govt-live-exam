import "server-only";
import fs from "node:fs";
import path from "node:path";
import { slugify } from "./content";
import type { Exam, ExamSummary, Question } from "./exam-types";

const EXAMS_DIR = path.join(process.cwd(), "exams");

function fail(file: string, message: string): never {
  throw new Error(`exams/${file}: ${message}`);
}

function parseQuestion(file: string, raw: unknown, n: number, defaultSubject: string): Question {
  let q: unknown, options: unknown, answer: unknown, explanation: unknown, subject: unknown;

  // Short form:  ["question", ["a", "b", "c", "d"], 1]
  if (Array.isArray(raw)) {
    [q, options, answer, explanation, subject] = raw;
  } else if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    q = o.q ?? o.question;
    options = o.options;
    answer = o.answer;
    explanation = o.explanation;
    subject = o.subject;
  } else {
    fail(file, `question ${n} must be an object or an array`);
  }

  if (typeof q !== "string" || !q.trim()) fail(file, `question ${n} has no question text`);
  if (!Array.isArray(options) || options.length < 2 || options.some((o) => typeof o !== "string")) {
    fail(file, `question ${n} needs at least 2 options, each as text`);
  }
  if (typeof answer !== "number" || !Number.isInteger(answer) || answer < 0 || answer >= options.length) {
    fail(
      file,
      `question ${n}: "answer" is the position of the right option, counting from 0 (use 0 to ${options.length - 1})`,
    );
  }

  return {
    subject: typeof subject === "string" && subject.trim() ? subject.trim() : defaultSubject,
    q: q.trim(),
    options: options as string[],
    answer,
    explanation: typeof explanation === "string" && explanation.trim() ? explanation.trim() : undefined,
  };
}

function num(file: string, value: unknown, field: string, fallback: number, min = 0): number {
  if (value === undefined) return fallback;
  if (typeof value !== "number" || !Number.isFinite(value) || value < min) {
    fail(file, `"${field}" must be a number${min > 0 ? " greater than 0" : ""}`);
  }
  return value;
}

function parseExam(file: string, data: unknown): Exam {
  if (!data || typeof data !== "object" || Array.isArray(data)) fail(file, "the file must contain one JSON object");
  const d = data as Record<string, unknown>;

  if (typeof d.title !== "string" || !d.title.trim()) fail(file, 'missing "title"');
  if (!Array.isArray(d.questions) || d.questions.length === 0) fail(file, '"questions" must be a non-empty list');

  const defaultSubject = typeof d.subject === "string" && d.subject.trim() ? d.subject.trim() : d.title.trim();
  const questions = d.questions.map((raw, i) => parseQuestion(file, raw, i + 1, defaultSubject));

  const counts = new Map<string, number>();
  for (const q of questions) counts.set(q.subject, (counts.get(q.subject) ?? 0) + 1);

  return {
    slug: slugify(file.replace(/\.json$/i, "")),
    title: d.title.trim(),
    description: typeof d.description === "string" ? d.description : undefined,
    duration: num(file, d.duration, "duration", 60, 0.01),
    marksPerQuestion: num(file, d.marksPerQuestion, "marksPerQuestion", 1, 0.01),
    negativeMarking: num(file, d.negativeMarking, "negativeMarking", 0),
    cutMark: d.cutMark === undefined ? undefined : num(file, d.cutMark, "cutMark", 0),
    instructions: Array.isArray(d.instructions) ? d.instructions.filter((x): x is string => typeof x === "string") : [],
    subjects: [...counts].map(([name, count]) => ({ name, count })),
    questions,
  };
}

let cached: Exam[] | null = null;

export function getAllExams(): Exam[] {
  if (cached && process.env.NODE_ENV === "production") return cached;
  if (!fs.existsSync(EXAMS_DIR)) return (cached = []);

  const files = fs
    .readdirSync(EXAMS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".json") && !f.startsWith("_") && !f.startsWith("."))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  cached = files.map((file) => {
    let data: unknown;
    try {
      data = JSON.parse(fs.readFileSync(path.join(EXAMS_DIR, file), "utf8"));
    } catch (e) {
      fail(file, `not valid JSON (${(e as Error).message})`);
    }
    return parseExam(file, data);
  });
  return cached;
}

export const getExam = (slug: string) => getAllExams().find((e) => e.slug === slug);

export function getExamSummaries(): ExamSummary[] {
  return getAllExams().map((e) => ({
    slug: e.slug,
    title: e.title,
    description: e.description,
    duration: e.duration,
    questionCount: e.questions.length,
    subjectCount: e.subjects.length,
    fullMarks: Math.round(e.questions.length * e.marksPerQuestion * 100) / 100,
  }));
}
