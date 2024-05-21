const wpConfig = require( '@wordpress/prettier-config' );

module.exports = {
	...wpConfig,
	printWidth: 120,
	overrides: [
		...wpConfig.overrides,
		{
			files: '*.yml',
			options: {
				tabWidth: 2,
				useTabs: false,
			},
		},
	],
};
