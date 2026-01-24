/**
 * ESLint Configuration - Catch TypeScript errors before deployment
 */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  rules: {
    // CORE: Prevent deployment-blocking type errors
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-undef': 'off' // TypeScript handles this
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'dist/',
    'build/',
    '*.config.{js,ts}',
    '.husky/',
    'packages/database/prisma/'
  ],
  overrides: [
    {
      files: ['.eslintrc.js', '**/scripts/**'],
      env: {
        node: true,
        browser: false
      }
    }
  ]
}
