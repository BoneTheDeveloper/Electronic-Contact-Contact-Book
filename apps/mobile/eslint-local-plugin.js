/**
 * Local ESLint Plugin for React Native Boolean Props
 * This file defines a local plugin that can be referenced in .eslintrc.js
 */

const rule = require('./eslint-rules/no-string-boolean-props/rule.js');

module.exports = {
  rules: {
    'no-string-boolean-props': rule,
  },
};
