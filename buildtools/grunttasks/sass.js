var files = {
	'<%= buildresourcespath %>/css/styles.css': '<%= resourcespath %>/sass/styles.scss',
	'<%= buildresourcespath %>/css/base.css': '<%= resourcespath %>/sass/base.scss'
};

module.exports = {
	option: {
		imagePath: '<%= buildresourcespath %>/images'
	},
	development: {
		options: {
			sourceMap: true,
			outputStyle: 'nested',
		},
		files: files

	},
	production: {
		options: {
			sourceMap: false,
			outputStyle: 'compressed',
		},
		files: files
	}
};
