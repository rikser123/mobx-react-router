module.exports = {
    env: {
        browser: true,
        node: true,
    },
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:import/typescript",
        "prettier", 
    ],
    settings: {
        react: { version: "detect" },
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        jsx: true,
        useJSXTextNode: true,
    },
    plugins: ["@typescript-eslint", "import"],
    rules: {
        "no-console": "warn",
    },
};