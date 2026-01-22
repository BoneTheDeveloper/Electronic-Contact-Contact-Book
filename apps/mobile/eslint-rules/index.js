/**
 * ESLint Plugin: Local No String Boolean Props
 */

const rule = require('./no-string-boolean-props/rule.js');

module.exports = {
  rules: {
    'no-string-boolean-props': rule,
  },
};
