import { readJsonSync } from "fs-extra";
import generatePackageJson from "rollup-plugin-generate-package-json";
import { defineConfig } from "vite";
import { z } from "zod";

const ENTRY_FILE = "./src/database/triggers.ts";
const CODEBASE = "default";

export default defineConfig({
  ssr: {
    external: ["firebase-admin", "firebase-functions"],
    noExternal: true,
  },
  build: {
    ssr: ENTRY_FILE,
    outDir: getOutputDirPath(CODEBASE),
    target: "node20",
    rollupOptions: {
      output: {
        format: "cjs",
        entryFileNames: "index.js",
        inlineDynamicImports: true,
        exports: "named",
      },
      plugins: [
        generatePackageJson({
          baseContents: {
            name: "functions",
            engines: {
              node: "20",
            },
            main: "index.js",
            private: true,
          },
        }),
      ],
    },
    emptyOutDir: true,
  },
});

function getOutputDirPath(codebase = "default") {
  const firebaseConfig = z
    .object({
      functions: z.array(
        z.object({
          source: z.string(),
          codebase: z.string(),
          runtime: z.string(),
        }),
      ),
    })
    .parse(readJsonSync("./firebase.json"));
  const functionsConfig = firebaseConfig.functions.find(
    (config) => config.codebase === codebase,
  );
  if (!functionsConfig)
    throw new Error(
      `Functions config for codebase "${codebase}" is not found in "firebase.json"`,
    );

  return functionsConfig.source;
}
