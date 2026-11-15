# Study Desk

A personal study site. Drop `.md` and `.pdf` files into `content/`, push to GitHub, and Vercel or Netlify publishes them.

Built with Next.js, TypeScript and Tailwind CSS.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. New files in `content/` appear after you save.

## Add your files

```
content/
├── eee-3105/
│   ├── _folder.json          { "title": "EEE 3105", "order": 1 }
│   ├── 01-transmission.md
│   └── 02-lecture-slides.pdf
└── computer-vision/
    └── cnn-basics.md
```

- Folders become sidebar sections, and they can be nested.
- Start names with numbers (`01-`, `02-`) to set the order.
- Page title: `title:` in the file's frontmatter, else the first `# Heading`, else the file name.
- Names starting with `_` or `.` are ignored. Use `_drafts/` for work in progress.
- Put images and PDFs next to your notes and link them with relative paths.
- Delete `content/getting-started/` when you no longer need it.

Optional frontmatter in a note:

```md
---
title: Sag and Tension
description: One line shown in search and page metadata
order: 2
updated: 2026-10-29
tags: [exam, chapter-2]
---
```

## Live exams

Open `/live-exam`. Each exam has three phases: **info**, **exam** (all questions on one page with a countdown), and **result** (score cards, a mark sheet by subject, and every question with the right answer).

Add an exam by putting a `.json` file in `exams/`. Copy `exams/_template.json` to start.

```json
{
  "title": "Bank Model Test 1",
  "duration": 60,
  "marksPerQuestion": 1,
  "negativeMarking": 0.25,
  "cutMark": 40,
  "questions": [
    { "subject": "English", "q": "Question text", "options": ["A", "B", "C", "D"], "answer": 1, "explanation": "optional" },
    ["Short form: question", ["A", "B", "C", "D"], 2]
  ]
}
```

- `answer` is the position of the right option, counting from 0 (0 = first option).
- `subject` is optional. Questions with different subjects get separate rows in the mark sheet.
- `cutMark` is optional. Without it, the result shows n/a.
- `duration` is in minutes. The exam is submitted automatically when time ends.
- Marks = correct x marksPerQuestion - wrong x negativeMarking.
- Files starting with `_` are ignored. A mistake in a file (for example an `answer` outside the options) stops the build and names the file and question.
- Progress (answers, running clock, result) is saved in the browser. Refreshing does not lose it. "Take the exam again" clears it.
- Labels are in `src/lib/exam-text.ts`. Change them there.
- The questions and answers are part of the page data, so anyone who inspects the page can find them. Fine for self-study, not for a graded test.

## Deploy

1. Push this folder to a GitHub repository.
2. **Vercel**: import the repo at vercel.com/new. No settings to change.
3. **Netlify**: import the repo at app.netlify.com. It detects Next.js on its own.

Every `git push` publishes the new version.

### Keep it private

A deployed site is public by default. Options:

- Keep the GitHub repo private (the site itself is still public).
- Use Vercel Deployment Protection or Netlify password protection (paid plans).
- Or leave out files you would not want others to read.

GitHub blocks files over 100 MB, so compress large PDFs.

## Customise

- `site.config.ts` sets the site title and description.
- Colours and fonts are in `src/app/globals.css`.
- Components are in `src/components/`, content handling is in `src/lib/content.ts`.

## Good to know

- PDF titles are searchable. PDF text is not.
- "Mark as read" and "Continue" are stored in the browser (localStorage), so they are per device.
- Search covers the first 8,000 characters of each note.
