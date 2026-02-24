# Evaluation Report Template

Use this template for the Phase 5 report output.

```
## Skill Safety Evaluation: [skill-name]

**Author**: [author/org]
**Repository**: [URL]
**Content SHA-256**: [hash of the evaluated skill directory]

### Phase 1: Provenance
- Author identity: PASS/FAIL - [details]
- Source repository: PASS/FAIL - [details]
- Known threats: PASS/FAIL
- Age/stability: PASS/FAIL

### Phase 2: Static Analysis
- Score: [X]/100
- CRITICAL findings: [none, or list]
- Other findings: [list each with severity]

### Phase 3: Third-Party Verification
- Vett.sh risk score: [X] ([None/Low/Medium/Critical])
- Vett.sh findings: [summary]

### Phase 4: Behavioral Analysis
- [findings, "Skipped", or "Requires human intervention"]

### Verdict: [SAFE / NEEDS REVIEW / REJECT]

### Operational Controls (if SAFE)
- Pin to commit: [specific SHA]
- Restrict allowed-tools: [recommended scope]
- Re-evaluation schedule: [see frequency guide below]
```

## Report guidelines

- Fill in every field — do not skip phases even if they passed cleanly
- For Phase 2 findings, list each finding with its checklist number and severity
- The Content SHA-256 should be computed over the entire skill directory for reproducibility
- If Phase 4 was skipped, state "Skipped — not required based on Phase 2/3 scores"
- If Phase 4 requires human intervention, state "Requires human intervention — see Phase 4 instructions"
