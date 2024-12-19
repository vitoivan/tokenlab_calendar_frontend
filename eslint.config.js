import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic/js': stylisticJs
    },
    rules: {
      indent: ["error", 2],
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": ["warn", { ignoreRestArgs: true }],
      'react-refresh/only-export-components': "off",
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
    },
  },
)
