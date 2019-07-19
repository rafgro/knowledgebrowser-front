module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "airbnb-base"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "linebreak-style": "off",
        "no-useless-return": "off", // this
        "consistent-return": "off", // this
        "no-else-return": "off",    // and this is needed to not fuck up response flow with passport
        "eqeqeq": "off", // for working with parameters in urls without bothering with parsing
        "no-console": "off", // we are not using any special loggers
        "object-curly-newline": "off",
        "func-names": "off",
        "prefer-promise-reject-errors": "off" // did not want to rewrite error system
    }
};