# Known Threats

Use this reference during Phase 1 (provenance check) and when evaluating any skill.

## Known malicious actors

Reject any skill authored by these accounts immediately (source: Snyk ToxicSkills study, February 2026).

| Account | Technique | Details |
|---|---|---|
| `zaycv` | Programmatic generation | 40+ malicious skills generated programmatically with hidden payloads |
| `Aslaep123` | Credential harvesting | Skills targeting crypto wallet credentials |
| `aztr0nutzs` | Pre-built malicious repos | Repositories designed to look like legitimate skill collections |
| `pepe276` | Unicode obfuscation | Prompt injection hidden with Unicode direction overrides and zero-width characters |

Update this list as new threat actors are identified. Check the latest Snyk, vett.sh, and security community reports.

## Threats beyond static analysis

These attack vectors cannot be fully detected by the Phase 2 static analysis checklist. Watch for them during evaluation and in operational monitoring.

### Skill name typosquatting

Attackers publish skills with names similar to popular legitimate skills (e.g., `code-reveiw` to impersonate `code-review`, `anthropics-testing` to impersonate an Anthropic skill). Compare the skill name against known-good skills from the same domain. Flag any name within edit-distance 2 of a known skill from a different author.

### Popularity manipulation

Download counters on skills.sh and similar platforms lack anti-automation protections. Attackers inflate rankings to increase adoption. High install counts alone do not indicate safety.

### Post-approval mutation ("rug pull")

A skill behaves legitimately during initial review but is later updated with malicious content. Users who do not pin to specific commits automatically receive the compromised version. Always pin to a specific commit SHA and re-evaluate on every update.

### Agent memory manipulation

Malicious skills modify `.claude/` directories (CLAUDE.md, memory files) to achieve persistent compromise across sessions. Monitor `.claude/` for unauthorized modifications after every skill invocation.

## Key security research

- **Snyk ToxicSkills (Feb 2026)**: 3,984 skills scanned, 13.4% critical, 76 confirmed malicious payloads
- **Cato CTRL MedusaLocker (Oct 2025)**: Ransomware deployed via disguised skill; after initial consent, hidden subprocesses inherit trusted status
- **Arxiv prompt injection (Jan 2026)**: 85%+ of attacks compromise at least one major platform; adaptive attacks bypass 90%+ of defenses
- **Vett.sh analysis**: 8,244 skills analyzed, 738 flagged with critical findings
