// eslint.config.js
import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import pluginPrettier from 'eslint-plugin-prettier'

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ['dist', 'node_modules', 'coverage', 'typeorm-cli.js']
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly'
      },
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      prettier: pluginPrettier
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-console': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal'
            }
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always'
        }
      ]
    }
  },
  prettier
]
