const fs = require('fs-extra');
const path = require('node:path');
const prompts = require('../lib/prompts');

function resolveCapsulePath(capsulePath) {
  if (capsulePath) {
    return path.resolve(capsulePath);
  }

  return path.resolve(process.cwd(), '.morebetter', 'capsules', 'design-system.json');
}

async function executeCapsule(options = {}) {
  const adapter = options.adapter || 'local';
  const capsulePath = resolveCapsulePath(options.capsule);

  const exists = await fs.pathExists(capsulePath);

  if (options.dryRun) {
    await prompts.log.info(`[dry-run] Would execute capsule with adapter "${adapter}": ${capsulePath}`);
    if (!exists) {
      await prompts.log.warn(`[dry-run] Capsule does not exist yet: ${capsulePath}`);
    }
    return { adapter, capsulePath, capsule: null, executed: false };
  }

  if (!exists) {
    throw new Error(`Capsule not found: ${capsulePath}`);
  }

  const capsule = await fs.readJson(capsulePath);

  await prompts.log.success(`Executed ${capsule.kind || 'capsule'} using adapter "${adapter}".`);
  return { adapter, capsulePath, capsule, executed: true };
}

module.exports = {
  executeCapsule,
};
