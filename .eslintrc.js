/** @type {import('eslint').ESLint.ConfigData} */
const config = require( './eslint/.eslintrc.js' );

config.rules = {
	...config.rules,
	'no-console': 'off',
};

module.exports = config;
