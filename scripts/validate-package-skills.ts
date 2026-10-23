// Validates the agent skills bundled in the packages (pnpm "agent skills in dependencies" feature):
// - every skills/<name>/SKILL.md has a frontmatter "name" matching its folder and a "description"
// - every file under skills/ is included in the packed tarball (requires "skills" in the package.json "files" field)

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PackagesPath = path.resolve(import.meta.dirname, "../packages");
// See https://agentskills.io/specification.
const NameRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MaxNameLength = 64;
const MaxDescriptionLength = 1024;

interface PackResult {
    files: { path: string }[];
}

function listFiles(directory: string): string[] {
    return fs.readdirSync(directory, { recursive: true, withFileTypes: true })
        .filter(x => x.isFile())
        .map(x => path.relative(directory, path.join(x.parentPath, x.name)).replaceAll("\\", "/"));
}

function parseFrontmatter(content: string) {
    const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);

    if (!match) {
        return undefined;
    }

    const name = /^name:[ \t]*(.+)$/m.exec(match[1])?.[1].trim();
    // Supports inline descriptions and block scalar descriptions (|, >, with optional chomping indicator),
    // where every continuation line must be indented.
    const description = /^description:[ \t]*(?:[|>][+-]?[ \t]*\r?\n((?:[ \t]+.*(?:\r?\n|$))+)|(?![ \t]*[|>][+-]?[ \t]*$)(.+))/m.exec(match[1]);
    // Strips the quotes of an inline quoted description, so an empty quoted string is reported as missing.
    const value = (description?.[1] ?? description?.[2])?.trim().replace(/^(["'])(.*)\1$/, "$2").trim();

    return {
        name,
        description: value
    };
}

const errors: string[] = [];
let skillCount = 0;

for (const packageName of fs.readdirSync(PackagesPath)) {
    const packagePath = path.join(PackagesPath, packageName);
    const skillsPath = path.join(packagePath, "skills");

    if (!fs.existsSync(skillsPath)) {
        continue;
    }

    for (const skillName of fs.readdirSync(skillsPath)) {
        const skillFilePath = path.join(skillsPath, skillName, "SKILL.md");

        if (!fs.existsSync(skillFilePath)) {
            errors.push(`${packageName}: skills/${skillName} is missing a SKILL.md file.`);
            continue;
        }

        skillCount++;

        const frontmatter = parseFrontmatter(fs.readFileSync(skillFilePath, "utf8"));

        if (!frontmatter) {
            errors.push(`${packageName}: skills/${skillName}/SKILL.md is missing a YAML frontmatter.`);
            continue;
        }

        if (frontmatter.name !== skillName) {
            errors.push(`${packageName}: skills/${skillName}/SKILL.md frontmatter name "${frontmatter.name}" must match its folder name "${skillName}".`);
        }

        if (!NameRegex.test(skillName) || skillName.length > MaxNameLength) {
            errors.push(`${packageName}: skill name "${skillName}" must be lowercase kebab-case and at most ${MaxNameLength} characters.`);
        }

        if (!frontmatter.description) {
            errors.push(`${packageName}: skills/${skillName}/SKILL.md is missing a description.`);
        } else if (frontmatter.description.length > MaxDescriptionLength) {
            errors.push(`${packageName}: skills/${skillName}/SKILL.md description must be at most ${MaxDescriptionLength} characters.`);
        }
    }

    const packed = JSON.parse(execSync("pnpm pack --dry-run --json", {
        cwd: packagePath,
        encoding: "utf8"
    })) as PackResult;

    const packedFiles = new Set(packed.files.map(x => x.path));

    for (const file of listFiles(skillsPath)) {
        if (!packedFiles.has(`skills/${file}`)) {
            errors.push(`${packageName}: skills/${file} is not included in the packed package. Add "skills" to the package.json "files" field.`);
        }
    }
}

if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
}

console.log(`Validated ${skillCount} package skill(s).`);
