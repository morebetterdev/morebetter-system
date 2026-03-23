const prompts = require('../lib/prompts');
const { executeCapsule } = require('../services/execution-adapter-service');

module.exports = {
  command: 'execute',
  description: 'Execute a generated capsule via the configured adapter',
  options: [
    ['--capsule <path>', 'Path to the capsule file to execute'],
    ['--adapter <name>', 'Execution adapter to use (default: local)'],
    ['--dry-run', 'Preview execution without running the adapter'],
  ],
  action: async (options) => {
    try {
      await executeCapsule(options);
      process.exit(0);
    } catch (error) {
      await prompts.log.error(`Execute command failed: ${error.message}`);
      process.exit(1);
    }
  },
};
