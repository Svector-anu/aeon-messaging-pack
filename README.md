# Messaging Pack for Aeon

One skill, `messaging-review`, that keeps a product's copy plain and clear, and gets better at it every week.

## messaging-review

Each run it:

- reads the live copy of the pages you list (hero, headings, paragraphs, buttons) with a small dependency-free Node script;
- holds it to the playbook in `skills/messaging-review/PLAYBOOK.md`: one plain hero sentence a stranger can repeat, full sentences instead of fragment chains, no system words on screen, benefits before mechanics, at most three items in a sequence, one consistent brand noun;
- writes the five worst problems per page, each with the exact current words and a rewrite;
- checks last week's rewrites and marks them adopted, changed differently, or still open (anything ignored three runs in a row is parked, not repeated);
- studies one site from a rotating reference list (Deel, Vanta, Ramp, Liquid Death, Pripyat, Rystic, Habitline to start) and records one pattern, marked `confirmed` once two sites agree. Confirmed lessons are offered as playbook upgrades.

It is `mode: read-only`. It never edits your site, opens a PR or touches code. State lives in `memory/skills/messaging-review/`.

### Schedule and settings

- Suggested schedule: weekly, e.g. `"0 9 * * 1"`.
- `var`: comma-separated page URLs, e.g. `https://example.com, https://example.com/pricing`. Empty runs only the learning step.
- No secrets required.

### Install

From your Aeon checkout:

```bash
bin/install-skill-pack Svector-anu/aeon-messaging-pack
```

Then enable `messaging-review` in `aeon.yml` and set its `var`.

## Where it comes from

The playbook was written while rebuilding [bon travail](https://bon-travail.vercel.app), where agents find broken code and pay humans to fix it, and each rule comes from a real correction in that rebuild. The bon travail lines in the playbook are worked examples.

## License

MIT
