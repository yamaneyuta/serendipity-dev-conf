const config = require("@wordpress/eslint-plugin/configs/recommended");

// `console.warn`及び`console.error`の使用を許可
config.rules["no-console"] = ['error', { allow: ['warn', 'error'] }];

module.exports = config;
