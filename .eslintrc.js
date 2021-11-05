module.exports = {
  extends: ['@react-native-community'],
  plugins: ['simple-import-sort', 'unused-imports'],
  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages. `react` related packages come first.
          ['^react', '^@?\\w'],
          // Side effect imports.
          ['^\\u0000'],
          // Internal packages.
          ['^()(/.*|$)'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    'react-native/no-inline-styles': 0,
    'react-native/sort-styles': [
      'error',
      'asc',
      { ignoreClassNames: true, ignoreStyleProperties: false },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
  parserOptions: {
    project: ['./tsconfig.json', './example/tsconfig.json'],
  },
};
