# AI and Your Teaching: project notes

A workbook (eBook) for Week 7 of the AVTE Vet Tech New Faculty Academy. Static HTML, CSS, and JS; published with GitHub Pages at https://octc-id.github.io/avte-ai-workbook/

## Language

Follow Stephanie's language notes: https://github.com/stephs-stuff/steph-ai-style

For this workbook in particular:
- Coaching and friendly, still professional. Second person ("you"), contractions, plain verbs, short sentences.
- "Test or assignment" over "assessment," except where it echoes the academy's Week 5 title.
- No higher-ed jargon ("pedagogical," "leverage," "scaffold," "authentic assessment" → "assignments that show real skill").
- No punchy "it's X, not Y" lines, no "here's the thing," no tidy groups of three, no dramatic colons.
- No slogan-style shorthand (compact catchphrases like "experience first, name second"). Say the plain thing in a full sentence.
- The core idea is "your clinical eye and your teaching eye."

## Look

Lean into AVTE branding, not OCTC's.
- Amaranth `#ef3340` for large accents, rules, the cover band, and the legal-pad margin line only (4.0:1 on white).
- Deep blue `#144b8e` for headings, links, and any small text. `#c8102e` for small text that must read as red.
- Every place participants write is pale legal-pad yellow (`--pad`) with the red margin line.
- Serif headings, sans body.

## Structure

- `index.html`: cover, how the workbook works, contents
- `chapters/NN-short-name.html`: one page per chapter. Each has a "You'll leave with" card, a short read, a Try It section that ends with a "You'll know you're ready when" card, then Print and Clear buttons at the bottom.
- `resources/`: supporting pages
- The left contents panel is built from the `TOC` list at the top of `js/book.js`. Add a chapter's `href` there when it goes live.
- Bump the `?v=` number on `book.css` and `book.js` in every page when either file changes.

## Content rules

- SEE Framework (AI for Education): describe it in our own words, cite and link it, adapt activity formats with an "adapted from" line. Never reproduce its tables, graphics, reflection questions, or wording.
- TILT (Winkelmes): an optional, skippable review page in Part 1 (`chapters/tilt-review.html`), written for people who may have seen TILT many times. Chapter 5's revision planner uses its plain questions (Why it matters / What to do / What good looks like) with the TILT terms beside them. Don't re-teach it anywhere else. TILT Higher Ed materials are CC BY-NC-SA 4.0 (same as this workbook), so adapt them with credit. Chapter 5's revision planner follows the flow of Stephanie's TILT reflection worksheet: the assignment as it is now, the revised version, one change I'll make, and support I need. Leave out Kentucky Essential Skills references; this audience is national.
- The Padlet wall is embedded in Chapter 2 and is password protected. The password stays in Canvas, never in this public repo, and so does anything about participants. After the Fall 2026 cohort, replace the embed with a short note that the wall was for that cohort.
- Clinical content (cases, examples) gets a field check from Laura Neely before release.
- Answers save only in the reader's browser (`localStorage`). Nothing is sent anywhere.

## Workflow

Changes go on a branch with a pull request. Check every page at phone and desktop widths (no sideways scrolling, no script errors) before opening it.
