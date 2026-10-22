# `_update-third-parties` — design notes

> **Maintainers only.** This file is **not** loaded by the Claude Code skill loader — only `SKILL.md` is ingested when the skill is invoked. Keep operational instructions in `SKILL.md`; keep rationale here.

Adapted from [`workleap/wl-app`](https://github.com/workleap/wl-app/tree/main/.claude/skills/_update-third-parties). wl-app's Intent UI target has no equivalent here and was dropped.

| Decision | Choice | Why |
|---|---|---|
| Orchestrator model | `model: sonnet` | The orchestration is mechanical — prompt, dispatch, aggregate — so opus is wasted, but it must compose leaf briefs and merge reports; haiku under-serves that. Right-first-time tiering: a botched brief or dropped report line is a silent miss. |
| Leaf model and effort in the table, mirrored in the delegates' frontmatter | Each `Agent` leaf is dispatched at the table's model and effort; the `_update-*` delegates carry the same values in their frontmatter | A skill's `model:` is ignored inside a leaf — the dispatch sets it — while its `effort:` overrides the dispatch's, so the two copies stay identical. Inline `Skill` invocation would switch the *conversation* model per delegate and leave it on the last one; delegation confines each skill to its leaf. |
| Decisions hoisted to one up-front prompt | The orchestrator asks targets + follow-ups once; leaves are briefed to never prompt (deps: "neither") | Leaves can't reach the user mid-run. The user still walks away after one prompt. |
| Follow-ups run last, by a haiku runner leaf | reset + install, then lint + test, after the final target; skipped when deps changed nothing or failed | A runner leaf quarantines the lint/test log bulk; haiku because it's a verbatim relay. Skill updates alone never trigger lint + test — they only touch `.agents/skills/` and `skills-lock.json`. |
| Sequential targets | deps -> skills, never parallel | `_update-skills` gates on the versions in `package.json`, so it must see the bumped ones; both also contend on the pnpm store. |
| CI reuse | `.github/prompts/update-dependencies.md` dispatches `_update-dependencies` and `_update-skills` in `Agent` leaves directly, not this orchestrator | The orchestrator's value is the interactive prompt; CI has nobody to ask and runs its own validation loop (lint, tests, sample apps in a browser) instead of the follow-ups. Leaves, not inline `Skill` calls, so the skills' `model: sonnet` doesn't downgrade the main run that fixes breaking changes. A failed validation never reaches the skills step; skills are retried on the next weekly run. |
