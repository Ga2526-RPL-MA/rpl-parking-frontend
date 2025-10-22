module.exports = {
  // Run ESLint only on staged JS/TS files (fix where possible)
  "**/*.{js,jsx,ts,tsx}": (filenames) => [
    `pnpm exec eslint --fix ${filenames.join(" ")}`,
  ],
  // Run Prettier only on staged JSON/CSS/MD files
  "**/*.{json,css,scss,md,webmanifest}": (filenames) => [
    `pnpm exec prettier --write ${filenames.join(" ")}`,
  ],
};
