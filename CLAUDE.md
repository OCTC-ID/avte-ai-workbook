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

## Outcomes

The workbook holds to the two published Week 7 objectives, word for word. Every chapter works toward one of them.
- **Evaluate:** Evaluate the benefits, risks, and ethics of generative AI in teaching and assessment. (Chapters 1 to 3 and 5)
- **Create:** Design an AI-informed teaching approach and a clear course AI-use expectation for your context. (Chapters 6 and 7; Part 3, Chapters 8 to 12, carries it into the course)

Nothing is submitted for grading. Chapter 7 ends with a one-page "Week 7 takeaway" (the revised assignment and the AI-use statement) that participants save as a PDF and post in a follow-up discussion, then reply to two colleagues. Evaluate is met through the work itself and needs no separate submission.

## Alignment map

The line from start to finish. The academy objective this week rolls up to is "Evaluate the appropriate, ethical use of AI tools in teaching and assessment." Each chapter page shows the exact Week 7 objective it works toward in an `objective-tag` box.

| Chapter | Objective | What it covers | What the participant produces |
|---|---|---|---|
| 1 | Evaluate | Where AI helps, where it slips, what stays out | Readiness check |
| 2 | Evaluate | Benefits and risks from the learner's seat; what they held back | Four Padlet reflections |
| 3 | Evaluate | The risk to one of their own tests | Score; passed, partly, or failed |
| 4 (TILT) | Gets ready for Create | Purpose, Task, Criteria | Which part is thinnest |
| 5 | Evaluate | Clinical eye and teaching eye on the Chapter 3 result | One benefit, one risk, one ethical line for their teaching |
| 6 | Create (AI-informed teaching approach) | One change, based on what AI did, then a re-test | The revised part and the one change |
| 7 | Create (clear course AI-use expectation) | Course-level expectation, then a label and statement for the changed assignment | The course expectation, label, and statement |
| 8 | Create | SEE Framework in our own words, mapped to Chapters 1 to 7 | Self-check on safely, ethically, effectively |
| 9 | Create | Labels for the few assignments that count (where students show real skill), not every assignment | Labels and statements for up to three assignments |
| 10 | Create | Habits for students | A one-page student handout (prints on its own) |
| 11 | Create | First conversation; what to do when work seems off (no detectors) | A conversation plan and a first step |
| 12 | Create | Activities adapted from SEE formats, with vet tech examples | A plan to run one activity |
| Takeaway | Both | `chapters/week7-takeaway.html` pulls the answers above from the same browser, grouped under each objective | One-page PDF posted in the Resource Exchange |

Answers from other chapters are read with `data-from="page-stem:key"` (see `loadFrom` in `js/book.js`). Renaming a chapter file or a `data-save` key breaks the takeaway, so update both together.

## Look

Lean into AVTE branding, not OCTC's.
- Amaranth `#ef3340` for large accents, rules, the cover band, and the legal-pad margin line only (4.0:1 on white).
- Deep blue `#144b8e` for headings, links, and any small text. `#c8102e` for small text that must read as red.
- Every place participants write is pale legal-pad yellow (`--pad`) with the red margin line.
- Serif headings, sans body.

## Structure

- `index.html`: cover, how the workbook works, contents
- `chapters/NN-short-name.html`: one page per chapter. Each has a "You'll leave with" card, a short read, a Try It section that ends with a "You'll know you're ready when" card, then Print and Clear buttons at the bottom.
- `resources/`: supporting pages. `resources/label-maker.html` is the appendix tool that draws No AI / AI-supported / AI-integrated PNG labels with paw prints (`js/label-maker.js`, loaded only on that page).
- The left contents panel is built from the `TOC` list at the top of `js/book.js`. Part 2 and Part 3 items carry `lock: 'part2'` or `lock: 'part3'`, and cover cards carry `data-lock`. To hide a part until it opens, set it to `true` in `LOCKED` near the top of `js/book.js`; locked chapters show as coming soon in the contents and on the cover. Adding `?preview=1` to any page address shows locked parts in that browser (`?preview=0` turns it off). The pages themselves are always reachable by direct link.
- Footer: every page has the same blue footer with the version and last-updated date. Change `VERSION` and `LAST_UPDATED` near the top of `js/book.js` when publishing an update (the HTML holds the same text as a fallback).
- Downloads: the cover's "Download the workbook" section (`#download`) has PDF and EPUB placeholders. When the files are made, put them in `downloads/` as `AI-and-Your-Teaching.pdf` and `AI-and-Your-Teaching.epub`, set each card's `href` to its `data-file` path, and remove `aria-disabled` and the "Available soon" note. The downloads are read-only; the takeaway only works on the web.
- Progress tracker: TOC items with `track: true` show a status circle (empty, opened, done) and count toward "Your progress" at the top of the contents panel. Opening a page marks it opened; the "Mark this chapter done" button (added by `book.js` to `.page-tools`) marks it done. Status is stored per page in `localStorage` (`avte-wb:status:<href>`).
- Bump the `?v=` number on `book.css` and `book.js` in every page when either file changes.

## Content rules

- SEE Framework (AI for Education, https://www.aiforeducation.io/the-see-framework-for-generative-ai-literacy; Stephanie completed their SEE Train-the-Trainer in August 2026): describe it in our own words, cite and link it, adapt activity formats with an "adapted from" line. Never reproduce its tables, graphics, reflection questions, or wording.
- Small teaching (James M. Lang): the "one meaningful change" idea. Named in Chapter 6 where it's used, in Chapter 8 with the other names, in the Part 3 closing (end of Chapter 12), and first on the appendix `resources/keep-learning.html`. The only Lang quotation used is the verified one from *Small Teaching* (2016, p. 5): "small but powerful modifications to our course design and teaching practices." Don't add other Lang quotes without checking them against a source. Avoid slogan-style taglines for the idea.
- TILT (Winkelmes): Chapter 4, the last chapter of Part 1 prep (`chapters/04-a-quick-look-at-tilt.html`; Chapter 6 reads its saved answers). Planning assumption: the academy's Week 5 does not cover TILT, so the page is written for people meeting it for the first time, with a skim path for those who already use it. Chapter 6's revision planner uses its plain questions (Why it matters / What to do / What good looks like) with the TILT terms beside them. Don't re-teach it anywhere else. TILT Higher Ed materials are CC BY-NC-SA 4.0 (same as this workbook), so adapt them with credit. Chapter 6's revision planner follows the flow of Stephanie's TILT reflection worksheet: the assignment as it is now, the revised version, one change I'll make, and support I need. Leave out Kentucky Essential Skills references; this audience is national.
- The Padlet wall is embedded in Chapter 2 and is password protected. The password stays in Canvas, never in this public repo, and so does anything about participants. After the Fall 2026 cohort, replace the embed with a short note that the wall was for that cohort.
- Clinical content (cases, examples) gets a field check from Laura Neely or Tara before release.
- Answers save only in the reader's browser (`localStorage`). Nothing is sent anywhere.

## Workflow

Changes go on a branch with a pull request. Check every page at phone and desktop widths (no sideways scrolling, no script errors) before opening it.
