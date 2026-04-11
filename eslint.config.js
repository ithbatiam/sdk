import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      'src/lib/generated/**/*',
      'src/lib/examples/**/*',
      'src/**/*.spec.ts',
      'src/**/*.test.ts',
      'dist/**/*',
      'tmp/**/*',
      'coverage/**/*',
    ],
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-console': 'error',
    },
  },
];
