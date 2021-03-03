module.exports = {
    'env': {
        'es2021': true,
        'node': false,
        browser: true,
    },
    'extends': [
        'plugin:@typescript-eslint/recommended',
        "plugin:prettier/recommended",
        'eslint:recommended',
    ],
    // Specifies the ESLint parser
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module',
        project: 'tsconfig.json'
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'rules': {
        '@typescript-eslint/no-unused-vars': ["error",  { "vars": "all", "args": "all","argsIgnorePattern": "^_" }],
        "@typescript-eslint/no-useless-constructor": "error",
        "@typescript-eslint/array-type": 'error',
        '@typescript-eslint/no-empty-interface': "error",
        '@typescript-eslint/no-explicit-any': 'error',
        "no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-namespace": "off"
    }
};
