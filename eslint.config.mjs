// @ts-check
import * as eslintJs from "@chance/eslint";
import { globals } from "@chance/eslint/globals";
import * as react from "@chance/eslint/react";
import * as typescript from "@chance/eslint/typescript";

/** @type {import("eslint").Linter.Config[]} */
const configs = [
    eslintJs.getConfig({ ...globals.node, ...globals.browser }),
    typescript.config,
    react.config,
    {
        ignores: ["dist/**", ".next/**"],
        rules: {
            "prefer-const": ["warn", { destructuring: "all" }],
        },
    },
    {
        rules: {
            "react/jsx-pascal-case": ["warn", { allowNamespace: true }],
            "react/display-name": "error",
            "jsx-a11y/label-has-associated-control": [
                "warn",
                {
                    controlComponents: ["Checkbox"],
                    depth: 3,
                },
            ],
        },
    },
    { ignores: ["**/dist/**"] },
];

export default configs;
