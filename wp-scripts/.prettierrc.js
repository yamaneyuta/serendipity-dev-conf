const config = require( '@wordpress/scripts/config/.prettierrc.js' );

module.exports = {
	...config,
	printWidth: 120,
	overrides: [
		{
			files: '*.yml',
			options: {
				tabWidth: 2,
				useTabs: false,
			},
		},
	],
};
