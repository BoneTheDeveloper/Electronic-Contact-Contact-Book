/**
 * Local ESLint plugin definition
 * This file allows ESLint to find and load local custom rules
 */

const rule = require('./eslint-rules/no-string-boolean-props/rule.js');

module.exports = {
  rules: {
    'no-string-boolean-props': rule,
  },
};
