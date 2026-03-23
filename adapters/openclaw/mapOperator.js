/* eslint-disable unicorn/filename-case, unicorn/prefer-module */
const operatorMap = require('./operators.json');

function mapOperator(operator) {
  if (!operator || typeof operator !== 'string') {
    return {
      ok: false,
      mappedAgent: null,
      error: 'Operator is required and must be a string.',
    };
  }

  const normalizedOperator = operator.trim().toLowerCase();
  const mappedAgent = operatorMap[normalizedOperator] || null;

  if (!mappedAgent) {
    return {
      ok: false,
      mappedAgent: null,
      error: `Unknown operator: ${operator}`,
      availableOperators: Object.keys(operatorMap),
    };
  }

  return {
    ok: true,
    mappedAgent,
  };
}

module.exports = {
  mapOperator,
};
