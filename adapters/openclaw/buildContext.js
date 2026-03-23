/* eslint-disable unicorn/filename-case, unicorn/prefer-module */
function buildContext({ capsule, context = {} }) {
  return {
    ...context,
    capsule: capsule || null,
    invocationMode: context.stub ? 'stub' : 'openclaw',
  };
}

module.exports = {
  buildContext,
};
