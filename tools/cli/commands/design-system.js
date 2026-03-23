const prompts = require('../lib/prompts');
const { generateDesignSystemCapsule } = require('../services/capsule-generation-service');

module.exports = {
  command: 'design-system',
  description: 'Generate a design-system capsule for morebetter execution flows',
  options: [
    ['--source <path>', 'Source directory for design-system inputs (default: current directory)'],
    ['--output <path>', 'Output file for the generated capsule'],
    ['--dry-run', 'Preview generation without writing files'],
  ],
  action: async (options) => {
    try {
      await generateDesignSystemCapsule(options);
      process.exit(0);
    } catch (error) {
      await prompts.log.error(`Design-system command failed: ${error.message}`);
      process.exit(1);
    }
  },
};
