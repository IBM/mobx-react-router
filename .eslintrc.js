module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'prettier'],

  env: {
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'prettier/prettier': [
      'error',
      {
        eslintIntegration: true,
        stylelintIntegration: true,
        printWidth: 120,
        useTabs: false,
        tabWidth: 2,
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        endOfLine: 'auto',
        arrowParens: 'avoid',
      },
      { usePrettierrc: false },
    ],
    'import/extensions': [
      'error',
      {
        ts: 'never',
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        // memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: false,
      },
    ],
    'import/prefer-default-export': 0,
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: ['builtin', 'internal', 'external', 'sibling', 'parent', 'index'],
        alphabetize: {
          order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: true /* ignore case. Options: [true, false] */,
        },
      },
    ],
    '@typescript-eslint/consistent-type-imports': 'error',
    // '@typescript-eslint/no-explicit-any': [
    //   'error',
    //   {
    //     ignoreRestArgs: true,
    //     fixToUnknown: true,
    //   },
    // ],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
  },
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx'],
      rules: {
        'no-console': 0,
        'no-empty': 0,
      },
    },
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.d.ts'],
    },
  },
}
