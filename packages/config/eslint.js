import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Limits that keep functions, files and components small (see the system design doc). */
const sizeRules = {
  'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
  'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
  complexity: ['error', 10],
  'max-depth': ['error', 3],
  'max-params': ['error', 4],
};

const typeScriptRules = {
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-non-null-assertion': 'error',
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/no-unused-vars': [
    'error',
    { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
  ],
  'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
};

export function klozbuyEslint({ ignores = [] } = {}) {
  return defineConfig(
    {
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.expo/**',
        '**/.wrangler/**',
        '**/coverage/**',
        '**/drizzle/**',
        'legacy/**',
        ...ignores,
      ],
    },
    js.configs.recommended,
    tseslint.configs.recommended,
    {
      files: ['**/*.{ts,tsx}'],
      rules: { ...sizeRules, ...typeScriptRules },
    },
    {
      // React components may be longer than plain functions, but not God components.
      files: ['**/*.tsx'],
      rules: {
        'max-lines-per-function': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
      },
    },
    {
      files: ['**/*.test.{ts,tsx}'],
      rules: { 'max-lines-per-function': 'off', 'max-lines': 'off' },
    },
    {
      files: ['**/*.{js,cjs,mjs}'],
      languageOptions: { globals: { ...globals.node } },
    },
  );
}
