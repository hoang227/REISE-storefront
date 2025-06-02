/** @type {import("prettier").Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: false,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  jsxSingleQuote: false,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindAttributes: ['className', 'tw', 'clsx'],
  tailwindFunctions: ['clsx', 'cn', 'twMerge'],
}

export default config
