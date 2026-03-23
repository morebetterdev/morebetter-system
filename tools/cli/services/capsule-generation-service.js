const fs = require('fs-extra');
const path = require('node:path');
const prompts = require('../lib/prompts');

function resolveOutputPath(outputPath) {
  if (outputPath) {
    return path.resolve(outputPath);
  }

  return path.resolve(process.cwd(), '.morebetter', 'capsules', 'design-system.json');
}

async function generateDesignSystemCapsule(options = {}) {
  const sourcePath = path.resolve(options.source || process.cwd());
  const outputPath = resolveOutputPath(options.output);

  const capsule = {
    kind: 'design-system-capsule',
    generatedAt: new Date().toISOString(),
    sourcePath,
    metadata: {
      command: 'design-system',
      cli: 'morebetter',
    },
  };

  if (options.dryRun) {
    await prompts.log.info(`[dry-run] Would generate design system capsule from: ${sourcePath}`);
    await prompts.log.info(`[dry-run] Would write capsule to: ${outputPath}`);
    return { capsule, outputPath, written: false };
  }

  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeJson(outputPath, capsule, { spaces: 2 });

  await prompts.log.success(`Design system capsule generated: ${outputPath}`);
  return { capsule, outputPath, written: true };
}

module.exports = {
  generateDesignSystemCapsule,
};
