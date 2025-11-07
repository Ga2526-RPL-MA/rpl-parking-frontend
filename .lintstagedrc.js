module.exports = {
  "**/*.{js,jsx,ts,tsx}": (filenames) => [
    `pnpm exec eslint --fix ${filenames.map((f) => `"${f}"`).join(" ")}`,
  ],
  "**/*.{json,css,scss,md,webmanifest}": (filenames) => [
    `pnpm exec prettier --write ${filenames.map((f) => `"${f}"`).join(" ")}`,
  ],
};
