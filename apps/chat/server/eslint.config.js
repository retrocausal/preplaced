import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginPromise from 'eslint-plugin-promise';
import pluginN from 'eslint-plugin-n';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // FIX IS HERE: Add "eslint.config.js" to this list
  {
    ignores: [
      'dist/',
      'coverage/',
      'node_modules/',
      '**/*.d.ts',
      'jest.config.js',
      'eslint.config.js',
    ],
  },

  pluginJs.configs.recommended,
  pluginPromise.configs['flat/recommended'],
  pluginN.configs['flat/recommended-module'],
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      globals: { ...globals.node },
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'n/no-process-exit': 'off',
      'n/no-missing-import': 'off',
    },
  },

  eslintConfigPrettier,
];
