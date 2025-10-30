---
order: 10
meta:
    title: Troubleshooting - ESLint
---

# Troubleshooting

## File not found by the project service

If the ESLint CLI throws the following error: 

```
Parsing error: xyz.ts was not found by the project service. Consider either including it in the tsconfig.json or including it in allowDefaultProject.
```

This usually means that the project's `tsconfig.json` file does not include the specified file, in this example, `xyz.ts`.

To fix the issue:

1. Open the project's `tsconfig.json` file.
2. Locate the `include` field.
3. Make sure the pattern includes the missing file. If the `include` field is unnecessary, you can remove it entirely, TypeScript will then include all files in the project by default.
