/** @type {import("prettier").Config} */
const config = {
    arrowParens: "always",
    bracketSameLine: true,
    plugins: ["prettier-plugin-packagejson"],
    printWidth: 100,
    semi: true,
    singleQuote: false,
    tabWidth: 4,
    trailingComma: "all",
};

module.exports = config;
