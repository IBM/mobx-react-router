module.exports = require('neostandard')({
  semi: [1, 'always'],
  env: ['jest', 'jasmine'],
  camelcase: [0],
  'no-return-assign': [0],
  'no-undef': [0],
  'space-before-function-paren': [2, 'never'],
  'no-debugger': 0,
  'react/jsx-boolean-value': 0,
  'react/jsx-no-bind': [1, {
    allowArrowFunctions: true
  }],
  ignores: ['__test__/coverage', 'node_modules']
});
