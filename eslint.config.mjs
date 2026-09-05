import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Reference material, not source. `briohealth/` is an HTTrack mirror of
    // the old WordPress site — ~2,900 files, including every minified script
    // WordPress ships. Linting it buries real findings under 500 warnings.
    "briohealth/**",
    "planning/**",
  ]),
]);

export default eslintConfig;
