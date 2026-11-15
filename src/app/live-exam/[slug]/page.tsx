import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ExamRunner from "@/components/ExamRunner";
import { getAllExams, getExam } from "@/lib/exam";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllExams().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exam = getExam(decodeURIComponent(slug));
  return exam ? { title: exam.title } : {};
}

export default async function ExamPage({ params }: Props) {
  const { slug } = await params;
  const exam = getExam(decodeURIComponent(slug));
  if (!exam) notFound();
  return <ExamRunner exam={exam} />;
}
