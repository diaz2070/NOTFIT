import { FlatCompat } from '@eslint/eslintrc';
import parser from '@typescript-eslint/parser';

const compat = new FlatCompat();

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'src/lib/**',
      'src/db/prisma.ts',
      'src/components/ui/**',
    ],
  },
  ...compat.extends('airbnb'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:prettier/recommended'),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
        ecmaVersion: 2020,
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off', // Turning off prop spreading rule
      'react/jsx-filename-extension': [1, { extensions: ['.ts', '.tsx'] }],
      'import/no-extraneous-dependencies': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'react/no-array-index-key': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never',
        },
      ],
    },
  },
  {
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
];
