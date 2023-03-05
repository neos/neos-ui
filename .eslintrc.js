module.exports = {
    root: true,
    extends: [
        '@neos-project/eslint-config-neos',
        'plugin:@typescript-eslint/eslint-recommended'
    ],
    parser: '@typescript-eslint/parser',
    globals: {
        expect: true,
        sinon: false
    },
    env: {
        node: true
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        // Fix for incorrect unused var detection
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],

        // remove bs
        'operator-linebreak': 'off',
        'arrow-parens': 'off',
        'camelcase': 'off',

        // The following rules should be fixed and enabled again #nobody-likes-you-linter!
        'no-use-before-define': 'off',
        'default-case': 'off',
        'no-mixed-operators': 'off',
        'no-negated-condition': 'off',
        'complexity': 'off'
    },
}
