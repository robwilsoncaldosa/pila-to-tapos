import { plugin as shadcn } from "@shadcn/lint"
import tsParser from "@typescript-eslint/parser"
import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const fsPaths = [
  { name: "fs", message: "Only src/adapters/** and scripts/** may read the filesystem." },
  { name: "node:fs", message: "Only src/adapters/** and scripts/** may read the filesystem." },
  { name: "fs/promises", message: "Only src/adapters/** and scripts/** may read the filesystem." },
  { name: "node:fs/promises", message: "Only src/adapters/** and scripts/** may read the filesystem." },
]

const adapterPatterns = [
  {
    group: ["@/adapters", "@/adapters/*", "../adapters", "../adapters/*"],
    message: "Adapters are wired in src/composition-root.ts only.",
  },
]

const rootPatterns = [
  {
    group: ["@/composition-root", "../composition-root"],
    message: "Only framework entry points (pages, server actions, route handlers) call the composition root.",
  },
]

const frameworkPatterns = [
  {
    group: ["react", "react-dom", "react/*", "next", "next/*"],
    message: "This layer is framework-free.",
  },
]

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { shadcn },
    rules: {
      "shadcn/no-restyle": ["error", { allow: ["layout"] }],
    },
  },
  // Layering: no filesystem outside adapters and scripts; adapters only via the composition root.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/adapters/**", "src/composition-root.ts"],
    rules: {
      "no-restricted-imports": ["error", { paths: fsPaths, patterns: adapterPatterns }],
    },
  },
  // Domain: pure. No ports, services, adapters, app, React or Next.
  {
    files: ["src/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: fsPaths,
          patterns: [
            ...adapterPatterns,
            ...rootPatterns,
            ...frameworkPatterns,
            {
              group: [
                "@/ports",
                "@/ports/*",
                "@/services",
                "@/services/*",
                "@/app",
                "@/app/*",
                "../ports",
                "../ports/*",
                "../services",
                "../services/*",
                "../app",
                "../app/*",
              ],
              message: "src/domain may not import ports, services, adapters or app.",
            },
          ],
        },
      ],
    },
  },
  // Services: domain and ports only.
  {
    files: ["src/services/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: fsPaths,
          patterns: [
            ...adapterPatterns,
            ...rootPatterns,
            ...frameworkPatterns,
            {
              group: [
                "@/app",
                "@/app/*",
                "@/components",
                "@/components/*",
                "@/lib",
                "@/lib/*",
                "../app",
                "../app/*",
                "../components",
                "../components/*",
                "../lib",
                "../lib/*",
              ],
              message: "src/services may import only domain and ports.",
            },
          ],
        },
      ],
    },
  },
])

export default eslintConfig
