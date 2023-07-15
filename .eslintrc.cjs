/* eslint-env node */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
    'prettier',
    'react-app/jest',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: '**/tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh', 'react', '@typescript-eslint', 'import'],
  rules: {
    'no-var': 'error', // var 키워드 사용을 금지합니다.
    'no-multiple-empty-lines': 'error', // 여러 개의 빈 줄 사용을 금지합니다.
    'no-console': ['warn', { allow: ['error'] }], // console.log() 사용을 경고 수준으로 설정하고, console.error()는 허용합니다.
    eqeqeq: 'error', // 일치 연산자(===) 사용을 권장합니다.
    'dot-notation': 'error', // 객체 속성 접근 시 점 표기법을 사용하도록 권장합니다.
    'no-unused-vars': 'off', // 사용하지 않는 변수를 검사하지 않도록 설정합니다.
    '@typescript-eslint/no-unused-vars': 'error', // 사용하지 않는 TypeScript 변수를 검사합니다.
    'react/react-in-jsx-scope': 'off', // React를 import하지 않아도 JSX를 사용할 수 있도록 설정합니다.
    'react/prop-types': 'off', // PropTypes를 사용하지 않아도 되도록 설정합니다.
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        pathGroups: [
          {
            pattern: '@/*',
            group: 'internal',
            position: 'after',
          },
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
