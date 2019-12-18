module.exports = {
    // from https://gist.github.com/1natsu172/a65a4b45faed2bd3fa74b24163e4256e
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
        "airbnb",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript",
        "plugin:prettier/recommended",
        "prettier/@typescript-eslint"
    ],
    env: {
        jest: true
    },
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        "react/jsx-filename-extension": [1, { "extensions": [".tsx", ".jsx"] }],
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",

        // conflicts with prettier
        "react/jsx-one-expression-per-line": "off",

        // conflicts with prettier
        "react/jsx-wrap-multilines": {
            "declaration": "parens",
            "assignment": "parens",
            "return": "parens",
            "arrow": "parens",
            "condition": "ignore",
            "logical": "ignore",
            "prop": "ignore"
        },

        // just don't see why this is necessary
        "import/extensions": "never",

        "react/prop-types": "skipUndeclared",

        // would love to turn this back on, but not worth the effort since react-admin uses it so much, everywhere
        "react/jsx-props-no-spreading": "off",
        "no-underscore-dangle": "off",
        "prettier/prettier": [
            "error", {
                "singleQuote": true,
                "semi": false,
                "tabWidth": 2
            }
        ]
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
        "import/resolver": {
            "node": {
                "extensions": [".js", ".jsx", ".ts", ".tsx"]
            }
        }
    },
};