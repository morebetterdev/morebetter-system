/* eslint-disable unicorn/filename-case, unicorn/prefer-module */
const { spawnSync } = require('node:child_process');
const { mapOperator } = require('./mapOperator');
const { buildContext } = require('./buildContext');

function getInvocationCommand({ mappedAgent, context }) {
  if (context.stub || process.env.OPENCLAW_STUB === '1') {
    return {
      command: 'echo',
      args: [`openclaw agent run ${mappedAgent}`],
    };
  }

  return {
    command: 'openclaw',
    args: ['agent', 'run', mappedAgent],
  };
}

function run({ operator, capsule, context = {} }) {
  const mapping = mapOperator(operator);
  if (!mapping.ok) {
    return {
      status: 'error',
      artifacts: {
        capsule: capsule || null,
      },
      logs: [mapping.error],
      error: {
        code: 'UNKNOWN_OPERATOR',
        availableOperators: mapping.availableOperators || [],
      },
    };
  }

  const resolvedContext = buildContext({ capsule, context });
  const invocation = getInvocationCommand({
    mappedAgent: mapping.mappedAgent,
    context: resolvedContext,
  });

  const result = spawnSync(invocation.command, invocation.args, {
    encoding: 'utf8',
    cwd: resolvedContext.cwd || process.cwd(),
    env: { ...process.env, ...resolvedContext.env },
  });

  return {
    status: result.status === 0 ? 'ok' : 'error',
    artifacts: {
      capsule: resolvedContext.capsule,
      mappedAgent: mapping.mappedAgent,
      command: [invocation.command, ...invocation.args].join(' '),
    },
    logs: [result.stdout, result.stderr].filter(Boolean),
  };
}

module.exports = {
  run,
};
