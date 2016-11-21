var grunt = require('grunt');

var autoprefixerOptions = {
    browsers: ['Chrome > 25', 'Safari > 6', 'iOS 7', 'Firefox > 25'],
    remove: false,
    map: true
};

var autoprefixerOptionsBuild = {
    browsers: ['Chrome > 25', 'Safari > 6', 'iOS 7', 'Firefox > 25'],
    remove: false,
    map: false
};

module.exports = {
    development: {
		src: ['<%= buildresourcespath %>/css/base.css', '<%= buildresourcespath %>/css/styles.css'],
		options: {
			processors: [require('autoprefixer')(autoprefixerOptions)],
			map:true
		}
    },
    production: {
        src: ['<%= buildresourcespath %>/css/base.css', '<%= buildresourcespath %>/css/styles.css'],
		options: {
			processors: [require('autoprefixer')(autoprefixerOptionsBuild)],
			map:false
		}

    }

};
