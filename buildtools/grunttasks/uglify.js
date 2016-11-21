var grunt = require('grunt');
var options = {
    compress: true,
    mangle: true,
    sourceMap: true,
    sourceMapIncludeSources: true,
};

var grunttask = grunt.cli.tasks[0];
if (grunttask === 'build') {
    options.sourceMap = false;
    options.sourceMapIncludeSources = false;
}

module.exports = {
    options: options,


    iconTemplates: {
        src: '<%= buildresourcespath %>/js/app.icontemplates.js',
        dest: '<%= buildresourcespath %>/js/app.icontemplates.min.js'
    },
    templates: {
        src: '<%= buildresourcespath %>/js/app.templates.js',
        dest: '<%= buildresourcespath %>/js/app.templates.min.js'
    },
    application: {
        src: '<%= buildresourcespath %>/js/app.js',
        dest: '<%= buildresourcespath %>/js/app.min.js',
        options: {
            sourceMapIn: '<%= buildresourcespath %>/js/app.js.map'
        }
    },
    core: {
        src: '<%= buildresourcespath %>/js/core.js',
        dest: '<%= buildresourcespath %>/js/core.min.js',
        options: {
            sourceMapIn: '<%= buildresourcespath %>/js/core.js.map'
        }
    }
};
