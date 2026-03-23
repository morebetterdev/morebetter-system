const fs = require('node:fs');
const path = require('node:path');
const prompts = require('../lib/prompts');

function loadAdapter(adapterName) {
  const adapterPath = path.resolve(__dirname, '..', '..', '..', 'adapters', adapterName, 'runAgent.js');

  if (!fs.existsSync(adapterPath)) {
    throw new Error(`Adapter not found: ${adapterName}`);
  }

  const adapter = require(adapterPath);

  if (!adapter || typeof adapter.run !== 'function') {
    throw new TypeError(`Adapter ${adapterName} must export run({ operator, capsule, context }).`);
  }

  return adapter;
}

module.exports = {
  command: 'execute',
  description: 'Execute an operator through a configured adapter',
  options: [
    ['--adapter <name>', 'Adapter name (default: openclaw)'],
    ['--operator <name>', 'Operator name'],
    ['--capsule <value>', 'Capsule identifier or payload'],
    ['--stub', 'Use stub execution path (echo output)'],
  ],
  action: async (options) => {
    try {
      const adapterName = options.adapter || 'openclaw';

      if (!options.operator) {
        throw new Error('Missing required option: --operator <name>');
      }

      const adapter = loadAdapter(adapterName);
      const result = adapter.run({
        operator: options.operator,
        capsule: options.capsule,
        context: {
          stub: Boolean(options.stub),
        },
      });

      if (result.status === 'ok') {
        await prompts.log.success('Execution completed successfully.');
      } else {
        await prompts.log.error('Execution failed.');
      }

      for (const logLine of result.logs || []) {
        await prompts.log.message(logLine.trim());
      }

      if (result.artifacts) {
        await prompts.log.info(`Artifacts: ${JSON.stringify(result.artifacts)}`);
      }

      process.exit(result.status === 'ok' ? 0 : 1);
    } catch (error) {
      await prompts.log.error(`Execute failed: ${error.message}`);
      process.exit(1);
    }
  },
};
