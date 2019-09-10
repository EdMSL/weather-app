module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      "jsx": true,
    },
    ecmaVersion: 2018,
    project: "./tsconfig.json",
    tsconfigRootDir: ".",
    warnOnUnsupportedTypeScriptVersion: false,
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "airbnb-base",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: [
    "react",
    "jsx-a11y",
    "import",
    "react-hooks",
    "@typescript-eslint",
  ],
  rules: {
    "comma-dangle": 0,
    "comma-spacing": 0,
    "no-multi-spaces": 0,
    "no-trailing-spaces": 0,
    'operator-linebreak': ['error', 'before', { overrides: { '=': 'none' } }],
    "prefer-const": 0,
    "space-in-parens": 0,
    "space-infix-ops": 0,
    "semi-spacing": 0,
    "semi": [1, 'always'],
    "import/no-extraneous-dependencies": 0,
    "import/prefer-default-export": 0,
    "react/jsx-filename-extension": [1, {
      "extensions": [".tsx", ".jsx"],
    }],
    "react/jsx-fragments": [1, 'element'],
    "react/prefer-stateless-function": 0,
    "@typescript-eslint/member-delimiter-style": 0,
    "@typescript-eslint/interface-name-prefix": [2, {
      "prefixWithI": "always",
      "allowUnderscorePrefix": false,
    }],
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-var-requires": 0,
  },
  globals: {
  },
  settings: {
    "import/resolver": {
      webpack: {
        config: "./config/webpack.base.config.js",
      }
    },
    react: {
      version: "detect",
    },
  },
}
