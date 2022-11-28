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

        // The following rules should be fixed and enabled again
        'no-use-before-define': 'off',
        'default-case': 'off',
        'no-mixed-operators': 'off',
        'no-negated-condition': 'off',
        'complexity': 'off'
    },
}
