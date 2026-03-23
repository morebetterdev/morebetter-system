# MoreBetter Core Operator Workflow

## Purpose

Integrate new capabilities into BMAD/MoreBetter in the locations that are already discovered by installers and manifest generation.

## Steps

1. **Identify integration target**
   - Prefer `src/bmm-skills/...` when adding new workflows/operators.
   - If separation is required, create a proper module with `module.yaml` metadata.

2. **Apply discovery conventions**
   - Ensure every skill directory has `SKILL.md` with YAML frontmatter.
   - Frontmatter `name` MUST match the skill directory name.
   - Include a clear `description` for manifest and installer UX.

3. **Verify installer + manifest compatibility**
   - Confirm structure aligns with module lookup in `tools/cli/installers/lib/modules/manager.js`.
   - Confirm skill discovery aligns with recursive `SKILL.md` scanning in `tools/cli/installers/lib/core/manifest-generator.js`.

4. **Complete integration checks**
   - Validate no loose top-level folders are introduced for module-like content.
   - Keep capability content under existing source roots unless intentionally introducing a full module.

## Output

- A discoverable skill or module that installer and manifest generation include without custom path hacks.
