import nextPlugin from "eslint-config-next"

const eslintConfig = [
  ...nextPlugin,
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react-hooks/set-state-in-effect": "off",
    },
  },
]

export default eslintConfig

