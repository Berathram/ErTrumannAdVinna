module.exports = {
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { packageDir: '.' }],
    'no-use-before-define': 0,
  },
};
