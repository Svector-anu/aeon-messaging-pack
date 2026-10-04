
# Messaging playbook

A standard for product copy, learned the hard way while rebuilding bon travail
(agents find broken code and pay humans to fix it). Every rule below came
from a correction made during that rebuild or a pattern found in the
reference sites. The bon travail lines are worked examples; swap in your own
product's words.

## The seven rules

1. **Clear at first glance.** A stranger must know what this is and what to
   do within a few seconds. The hero is one plain sentence that says what
   happens and for whom. If they'd need the docs to follow it, it's wrong.
   - Good: "Agents find broken code and pay humans to fix it."
   - Bad: "Your agents find the work. People fix it. Proof pays."

2. **Full sentences, not fragment chains.** Copy like "Aeon finds. You
   decide. Tests verify. Proof pays." was rejected: that rhythm reads as
   AI-written and says less than it seems to. Write one flowing sentence. Use
   a short two-beat line only as a deliberate closer, once per page.

3. **No system words in front of users.** Internal names for states and
   mechanics never reach the screen. Translate them using the glossary below.
   If a word would only make sense to someone who read the code, cut it.

4. **Talk to the person reading.** Most products have two sides (teams that
   post work, humans who do it; buyers and sellers). Say on each page who it's
   for and what they get. Group navigation and footers by audience ("For
   humans", "For teams"), not by internal module.

5. **Benefits before mechanics.** The middle of the home page shows what
   changes for the reader, not a step-by-step walkthrough. Mechanics live in
   the docs. Link there with "See docs" or "See more", not "The details live
   in the docs".

6. **Less, always.** Hero, one middle section, footer. At most three moments
   in a sequence. One idea per block. If a section feels crowded, remove
   items before shrinking them.

7. **Use the brand's own words, every time.** Pick the noun and keep it
   (bon travail says "humans", never "people", "contributors" or "users").
   Write the brand name the same way everywhere (bon travail is lowercase).

## What each reference taught

| Site | Lesson | Example |
|---|---|---|
| Deel | Say the whole job in one plain line, then ask what the visitor wants to do | "Hire, manage, pay, & equip anyone, anywhere." |
| Vanta | Confident and calm; each feature is a name plus one-line benefit, often with relief | "Get your compliance together" |
| Ramp | Lead with outcomes and proof; reassure on control where money moves | outcome numbers; "never takes money-moving actions without human confirmation" |
| Liquid Death | Two-beat contrast with attitude, used for a closer or a twist | "Deadly mountains. Delicious water." |
| Pripyat (Dott) | Second person, calm; relief phrased as "no X, no Y"; one big closing line | "It offers, never orders" |
| Rystic | Few blocks, one idea each, one-word section heads | stateful / verified / local |
| Habitline | A real footer: brand line, link columns, legal row | |

## Process

1. **Research first.** Before writing, study 3–5 sites in the same space or
   with the voice wanted. Pull their hero, subline, section heads and CTAs
   word for word into notes. Write down the pattern, not the words.
2. **Name the audiences and the one action each should take.**
3. **Write the promise:** one sentence, what happens and for whom. Test it:
   could a stranger repeat it to a friend?
4. **Write the subline:** one sentence on who stays in control or what
   the payoff is. A small twist at the end is welcome ("…and not a minute
   before.").
5. **Middle section:** two or three outcomes, one sentence each, benefit first.
6. **Glossary pass:** replace every system word (table below).
7. **Microcopy pass:** buttons, empty states, statuses and errors each say
   what happens next, in the reader's terms.
8. **Read it aloud,** cut about a third, and check the seven rules again.

## Glossary: system word to screen word

| System says | Screen says |
|---|---|
| externalize a finding | post the work / hand it to a human |
| scoped work package | small fix / paid work |
| contributor, assignee, people | humans (or the brand's chosen noun) |
| CI failing, red build | broken code / what keeps breaking |
| acceptance job passed | it works / your fix works |
| escrowed, escrowing | the money is set aside / setting the money aside |
| settled | done / paid |
| claimed by @x | @x is on it |
| request verification | Done: check my fix |
| verifying, checks running | checking the fix |
| packages claimed | jobs taken |
| your work on record | your earnings |

## Microcopy patterns

- **Buttons** say the outcome: "Find paid work", "Done: check my fix",
  "Hand it to a human". Avoid generic "Submit", "Continue" or "Learn about X".
- **Empty states** say what will appear and when: "Nothing open right now.
  New work shows up here the moment a team posts it."
- **Statuses** are short, human and present tense: "@x is on it",
  "Checking the fix", "Paid 11h ago".
- **Titles generated from data** are rewritten for people: "Fix what's
  breaking usdc-sdk-examples", not `Fix "examples / Run examples" in org/repo`.
- **Lookups** need no account where possible, and say so: "No sign-up needed."

## Anti-patterns (each of these was rejected in review)

- Chains of three- or four-word sentences ("A does. B does. C pays.").
- Internal vocabulary on the page (finding, externalize, scoped, acceptance job, escrow).
- A middle section that only explains how it works.
- Five steps where three would do; crowded rows of labels.
- "The details live in the docs" and similar filler links.
- Clever-but-vague hero lines a stranger can't repeat.
- Calling the same audience by different names.

## Before and after (bon travail)

| Where | Before | After |
|---|---|---|
| Hero | Your agents find the work. People fix it. Proof pays. | Agents find broken code and pay humans to fix it. |
| Hero subline | Our agent, Aeon, spots tests that keep failing and works out why. You decide who fixes it. When their fix passes your tests, they are paid in USDC automatically. | Your agent spots what keeps breaking, you set the reward, and a human you trust fixes it. They get paid the moment it works, and not a minute before. |
| Middle heading | From a failing test to a paid fix. | What changes when your agents can pay humans |
| Middle caption | USDC leaves escrow on Arc for the wallet you approved, and a sealed receipt keeps every step. | When the fix works, they get paid on the spot, and you both keep a receipt. |
| Work page | work: Scoped fixes an engineering team chose to hand out. | paid work: Small fixes teams want done. The money is set aside before you start, and it's yours the moment your fix works. |
| Empty state | Nothing open. Work appears here when an engineer externalizes a finding from their console. | Nothing open right now. New work shows up here the moment a team posts it. |

## Final checklist

- [ ] A stranger gets it from the hero alone.
- [ ] No fragment chains; sentences flow.
- [ ] No system words anywhere a user can see.
- [ ] Each page says who it's for and what to do.
- [ ] The middle shows benefits; mechanics are behind "See docs".
- [ ] At most three items in any sequence; nothing feels crowded.
- [ ] Brand noun and brand name are consistent everywhere.
- [ ] Buttons, empty states and statuses say what happens next.
