// @ts-check
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import { dirname } from "path";
import tseslint, { parser as tseslintParser } from "typescript-eslint";
import { fileURLToPath } from "url";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

export default tseslint.config(
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  eslintConfigPrettier,
  {
    rules: {
      semi: "error",
      "no-empty": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "prefer-const": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-empty-interface": "warn",
      "@typescript-eslint/no-shadow": [
        "warn",
        { builtinGlobals: true, hoist: "functions", allow: ["Image"] },
      ],
    },
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        projectService: true,
      },
    },
  },
);
