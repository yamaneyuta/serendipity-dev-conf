const wpConfig = {
	useTabs: true,
	tabWidth: 4,
	printWidth: 80,
	singleQuote: true,
	trailingComma: "es5",
	bracketSameLine: false,
	bracketSpacing: true,
	semi: true,
	arrowParens: "always",
	parenSpacing: true,
	overrides: [
		{
			files: "*.{css,sass,scss}",
			options: {
				singleQuote: false,
				parenSpacing: false
			}
		}
	]
};

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
