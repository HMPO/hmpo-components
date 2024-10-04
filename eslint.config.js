const js = require('@eslint/js');
const globals = require('globals');


const styleRules = {
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-trailing-spaces': 'error',
    indent: 'error',
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'keyword-spacing': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': [
        'error',
        { anonymous: 'always', named: 'never' },
    ],
    'no-mixed-spaces-and-tabs': 'error',
    'comma-spacing': ['error', { before: false, after: true }],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
};


module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            globals: {
                ...globals.node,
            }
        },
        rules: {
            'no-unused-vars': [
                'error',
                { argsIgnorePattern: '^(err|req|res|next)$' },
            ],
            'one-var': ['error', { initialized: 'never' }],
            'no-var': 'error',
            ...styleRules,
        },
    },

    // Component
    {
        files: ['components/**/*.js'],
        languageOptions: {
            ecmaVersion: 2015,
            globals: {
                ...globals.browser,
                expect: 'readonly',
                it: 'readonly',
                render: 'readonly',
                cleanHtml: 'readonly',
                describe: 'readonly',
                beforeEach: 'readonly',
                sinon: 'readonly',
            },
        },
        rules: {
            'no-console': 'error',
            'no-var': 'off',
        },
    },
    // Unit tests
    {
        files: ['test/**'],
        languageOptions: {
            globals: {
                ...globals.mocha,
                sinon: 'readonly',
                expect: 'readonly',
            },
        },
    },
];
