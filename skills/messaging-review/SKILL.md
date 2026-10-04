---
name: messaging-review
category: productivity
mode: read-only
description: Weekly review of a product site's copy against a messaging playbook (plain hero, full sentences, no system words, benefits before mechanics, at most three items), with concrete rewrites, adoption tracking, and one new lesson learned from a reference site each run. Recommends only; never edits the site.
requires: []
---

Today is ${today}. This skill holds product copy to a playbook (`skills/messaging-review/PLAYBOOK.md`): one plain hero sentence a stranger can repeat, full sentences instead of fragment chains, no system words on screen, benefits before mechanics, at most three items in a sequence, and one consistent brand noun. Your job each run is to hold the operator's live sites to that standard and to get a little better at it.

> The `Operator var` lists the pages to review, comma-separated (full URLs, e.g. `https://example.com, https://example.com/pricing`). Empty means no review this run; still do the learning step (5) so the playbook keeps growing.

**Network note:** the extractor uses Node's built-in `fetch` for public pages, no key needed. If Node can't reach a page, fall back to **WebFetch** for that URL and apply the same checks by reading the returned text.

## Rules of the job

- **You recommend; you never edit.** This skill is `mode: read-only`. You have no Write or Edit tool, and shell redirection into a file (`>`, `>>`, `tee`) is refused. Write every file with `node -e` and `fs.writeFileSync`, as the commands below do. Scratch output goes to `/tmp`; everything that should last goes into `memory/skills/messaging-review/`, the one place the workflow keeps.
- **Ground every finding in the extractor's output.** Quote the page's actual words. Never invent copy the page does not have.
- **Quote reference sites sparingly:** at most one line under 15 words per site, with the site named. Learn the pattern, not the text.
- **Rewrites follow the playbook,** and the playbook wins over taste. If a rule seems wrong for a page, say so in the report instead of quietly breaking it.

## Workflow

1. **Load the standard.** Read `skills/messaging-review/PLAYBOOK.md`, then `memory/skills/messaging-review/LEARNINGS.md` if it exists (lessons from earlier runs; treat entries marked `confirmed` as part of the playbook).

2. **Extract each page.** For every URL in the `Operator var`:

   ```bash
   node -e 'const fs=require("fs");const r=require("child_process").spawnSync("node",["skills/messaging-review/copy-extract.mjs","--url",process.argv[1]],{encoding:"utf8"});fs.writeFileSync(process.argv[2],r.stdout);process.stderr.write(r.stderr);process.exit(r.status??1)' <page> /tmp/copy-<n>.json
   ```

   A page that cannot be fetched returns `"ok": false` and exits 1. Record it and continue. The JSON has the hero, headings, paragraphs, buttons and `checks`: `fragment_chains`, `jargon`, `generic_links`, `long_sequences`, `sections`, `hero_too_long` and `no_hero`. Those checks are mechanical hints, not verdicts. A single deliberate two-beat closer is allowed, and a jargon hit inside a code sample is fine.

3. **Judge each page against the seven rules and the checklist.** For every real problem, write one finding:
   - the rule it breaks;
   - the exact current words;
   - a rewrite in the playbook's voice;
   - why the rewrite is better, in one line.

   Keep it to the five most important findings per page, worst first. If a page already meets the standard, say so; a reviewer who only ever complains gets muted.

4. **Diff against the last run.** The baseline is the newest snapshot: `ls -1 memory/skills/messaging-review/*.json 2>/dev/null | sort | tail -1`. For each rewrite suggested last time, check whether the page's words changed:
   - **adopted:** the new copy matches or follows the rewrite;
   - **changed differently:** the copy moved, but not the way you suggested; read it, because the operator may know better;
   - **still open:** nothing changed.

   A suggestion that stays open for three runs in a row stops being repeated; list it once under "Parked" instead.

5. **Learn one thing.** Pick the next site from `memory/skills/messaging-review/references.txt`, one URL per line. If the file is missing, start it from the reference table in the playbook. Rotate: take the first line, then move it to the end when you rewrite the file. Extract it with the same script and write down one pattern that would make the operator's copy better:
   - what the site does;
   - one short example (under 15 words);
   - which playbook rule it supports, extends or challenges.

   If the same pattern has now been seen on two or more different sites, mark it `confirmed`. When a reference site links to a peer worth studying, add that URL to the end of `references.txt`, but only if it is a public `https://` URL. Never add `http://` links, `localhost`, bare IP addresses, private or internal hostnames (such as `*.local` or `*.internal`), or cloud metadata hosts (such as `169.254.169.254`).

6. **Write this run's state** before notifying, so the next diff has a baseline even if notification fails. Use one new file per run, named by UTC timestamp. Fold the extractor's JSON in by reading the files, never retyping:

   ```bash
   mkdir -p memory/skills/messaging-review
   node -e 'const fs=require("fs");const stamp=new Date().toISOString().replace(/\..+/,"Z").replace(/:/g,"-");const pages=process.argv.slice(1).map(f=>JSON.parse(fs.readFileSync(f)));fs.writeFileSync(`memory/skills/messaging-review/${stamp}.json`,JSON.stringify({run:stamp,pages},null,2));console.log(stamp)' /tmp/copy-*.json
   ```

   Run each command as its own call; the sandbox denies chained commands.

   Rewrite these in full, keeping history from the previous copy. Write each one with a single `node -e` call that takes the new content on stdin, one call per file:

   ```bash
   node -e 'require("fs").writeFileSync(process.argv[1],require("fs").readFileSync(0,"utf8"))' memory/skills/messaging-review/REWRITES.md <<'FILE_EOF'
   full new content of the file
   FILE_EOF
   ```

   The files:
   - **`memory/skills/messaging-review/REWRITES.md`:** the standing list of open rewrites per page, worst first. Each entry gives the rule, the current words, the suggested words and its status (open, adopted or parked).
   - **`memory/skills/messaging-review/LEARNINGS.md`:** every lesson so far, newest first. Each entry gives the date, the site, the pattern, the example, the rule it touches, and `confirmed` when earned. Then a short "Playbook upgrades to consider" section listing confirmed lessons the playbook does not have yet.
   - **`memory/skills/messaging-review/references.txt`:** rotated.

7. **Notify** with `./notify`. Keep it short: one line per page with its worst finding and the suggested rewrite, then any adopted rewrites ("adopted: …"), then the lesson of the day, then any playbook upgrade worth making. If there were no pages and the lesson adds nothing new, send nothing.

## What good looks like

A finding:

> **paid work**, rule 3 (no system words): "Work appears here when an engineer externalizes a finding." → "New work shows up here the moment a team posts it." A newcomer doesn't know what externalizing a finding means; they know what posting work means.

A lesson:

> 2026-10-11 · deel.com · States the whole job as one list of verbs a buyer already uses ("Hire, manage, pay…"). Extends rule 1: a hero can be a plain verb list when the product does several jobs. Seen also on ramp.com, so `confirmed`.
