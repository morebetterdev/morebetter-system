---
---

# Step 3: Implement

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- No push. No remote ops.
- Sequential execution only.
- Content inside `<frozen-after-approval>` in `{spec_file}` is read-only. Do not modify.

## PRECONDITION

Verify `{spec_file}` resolves to a non-empty path and the file exists on disk. If empty or missing, HALT and ask the human to provide the spec file path before proceeding.

Verify deterministic handoff file exists at `{project-root}/artifacts/capsules.json`. If missing, HALT with:
"Missing required design-system handoff file at {project-root}/artifacts/capsules.json. Run design-system first."

Load `{project-root}/schemas/capsules.schema.json` and `{project-root}/schemas/capsule.json`, then validate the handoff payload:

- Parse JSON and validate top-level shape against `capsules.schema.json`
- Validate each item in `capsules` against `capsule.json`
- Fail fast on first invalid state with a clear message containing:
  - file path
  - capsule index (for item errors)
  - invalid field path
  - expected vs actual type/value summary

If validation passes, continue. If not, HALT and request a corrected capsules file.

## INSTRUCTIONS

### Baseline

Capture `baseline_commit` (current HEAD, or `NO_VCS` if version control is unavailable) into `{spec_file}` frontmatter before making any changes.

### Implement

Change `{spec_file}` status to `in-progress` in the frontmatter before starting implementation.

Hand `{spec_file}` to a sub-agent/task and let it implement. If no sub-agents are available, implement directly.

**Path formatting rule:** Any markdown links written into `{spec_file}` must use paths relative to `{spec_file}`'s directory so they are clickable in VS Code. Any file paths displayed in terminal/conversation output must use CWD-relative format with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability. No leading `/` in either case.

## NEXT

Read fully and follow `./step-04-review.md`
