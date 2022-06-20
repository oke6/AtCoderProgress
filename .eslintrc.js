module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: [
    'prefer-arrow'
  ],
  rules: {
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-undef': 'off',
    'no-console': 'off',
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        'disallowPrototype': true,
        'singleReturnOnly': false,
        'classPropertiesAllowed': false
      }
    ]
  },
};
