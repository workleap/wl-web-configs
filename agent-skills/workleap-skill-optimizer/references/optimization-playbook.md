# Optimization Playbook

Expanded checklists, decision trees, examples, and templates that support the workflow in SKILL.md. Read the relevant section when pointed here from the workflow phases.

## Table of Contents

- [Pre-Optimization Checklist](#pre-optimization-checklist)
- [Body Retention Decision Tree](#body-retention-decision-tree)
- [Reference Guide Pattern](#reference-guide-pattern)
- [Maintenance Note Template](#maintenance-note-template)
- [Validation Question Generation](#validation-question-generation)
- [Common Anti-Patterns](#common-anti-patterns)
- [Recording Decisions in an ADR](#recording-decisions-in-an-adr)

## Pre-Optimization Checklist

Gather these before starting Phase 1:

- [ ] Current SKILL.md line count and estimated token count
- [ ] Current description character count
- [ ] List of all reference files with line counts
- [ ] List of sibling skills in the same repo (names + descriptions)
- [ ] A set of 15-25 validation questions (from the user or derived from trigger categories)
- [ ] Confirm the skill has `references/` files — if not, the first step is to identify body content that can be extracted into new reference files. Group related sections by domain (e.g., all related checks into one file, all setup/integration docs into another) before starting the optimization workflow.

## Body Retention Decision Tree

For each section in the SKILL.md body:

```
Is this section duplicated in a references/ file?
├── NO → Keep it (unique to the body)
└── YES → Does it meet a retention criterion?
    ├── Complex multi-step pattern (coordination across sections/files)? → KEEP
    ├── Non-obvious logic or parameters agents frequently miss? → KEEP
    ├── Unique concept with no external docs? → KEEP
    ├── Primary use case the skill exists for? → KEEP
    └── None of the above? → REMOVE
```

**Sections that typically stay:**
- Setup/bootstrapping patterns that wire 3+ files together (e.g., config + provider + app entry)
- Multi-step procedures where skipping or reordering steps causes subtle failures
- Function signatures or decision rules with documented pitfalls agents frequently miss
- Patterns with non-obvious required parameters that agents frequently omit

**Sections that typically move to references:**
- API property/option lists or checklist enumerations (bullet-point catalogues)
- Single-function examples (one import + one call) or single-rule explanations
- Integration setup steps or straightforward procedural instructions
- Type definitions, interfaces, or glossary-style definitions
- Simple variations of the same pattern (e.g., five log-level examples when one suffices)

## Reference Guide Pattern

After removing sections from the body, add a "Reference Guide" section that maps topics to files.

```markdown
## Reference Guide

For detailed documentation beyond the patterns above, consult:

- **`references/api.md`** — Initialization options, configuration properties, method signatures
- **`references/rules.md`** — Evaluation criteria, checklist items, decision tables
- **`references/patterns.md`** — Common patterns, error handling, testing recipes, pitfalls
- **`references/integrations.md`** — Third-party integrations, setup steps, workflow connections
```

Rules:
- Name each file with backtick formatting
- Use em-dash separator between file name and description
- List 2-3 specific topics per file so agents can decide whether to read it
- Every reference file must have a pointer — an unlinked file is undiscoverable

## Maintenance Note Template

Add at the bottom of the optimized SKILL.md:

```markdown
## Maintenance Note

Body budget: ~N lines. [Brief rationale for the split — what was moved and why].
[Optional: pointer to the ADR if one was created, e.g., "See [ADR-NNNN](path/to/adr)."]
New content goes in the appropriate `references/` file — only add to the body
if it is a critical pattern needed in nearly every conversation.
```

## Validation Question Generation

If the user does not provide validation questions, derive them from the description trigger categories:

1. For each trigger category, write 2-3 questions a developer would ask that require specific code examples or API details to answer.
2. Add 2-3 cross-cutting questions (e.g., "What are common pitfalls?", "How do I get started from scratch?").
3. Include at least one question per reference file to verify all files contribute.
4. Target 15-25 questions total.

## Common Anti-Patterns

### 1. Triggers in the body instead of the description
The body is only loaded after the skill triggers. "When to use" information in the body is invisible during skill selection. All triggers must stay in the YAML description.

### 2. Duplicating reference content in the body
If content exists in both the body and a reference file, remove it from the body. The whole point of references is on-demand loading.

### 3. Removing code examples from retained sections
Retained body sections are kept because they are complex. The code examples ARE the value. Compress surrounding prose if needed, never the code.

### 4. Over-compressing the description
The description is the trigger mechanism. Dropping keywords or merging unrelated categories causes the skill to stop triggering. Always verify 1:1 mapping of trigger categories.

### 5. Forgetting the Reference Guide section
After removing body sections, agents have no way to discover which reference file covers a topic. The Reference Guide section is load-bearing — without it, removed content becomes undiscoverable.

### 6. Creating empty reference files preemptively
Only create reference files that contain real content moved from the body or supporting existing body sections.

## Recording Decisions in an ADR

If the repository uses ADRs, record the optimization decisions. The ADR should capture:

1. Body size before/after (lines and estimated tokens)
2. Which sections were retained and which retention criterion each met
3. Which sections were removed and which reference file they map to
4. Description compression techniques applied
5. Validation results (questions passed, pre-existing gaps vs regressions)
6. The body-line budget for future updates

Then add pointers to the ADR from:
- The skill's Maintenance Note (for interactive agent sessions)
- Any automated sync workflow prompts (for CI agents)
- The ADR README index
