var grunt = require('grunt');
var options = {
    singleModule: true,
    htmlmin: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
    }
};



module.exports = {
    options: options,

    iconTemplates: {
        options: {
            module: 'app.icontemplates',
            base: 'resources/images/icons/'
        },
        src: ['resources/images/icons/*.svg'],
        dest: '<%= buildresourcespath %>/js/app.icontemplates.js'
    },
    templates: {
        options: {
            module: 'app.templates',
            base: 'App/',
        },
        src: ['<%= apppath %>/**/*.html', '!<%= apppath %>/html/index.html'],
        dest: '<%= buildresourcespath %>/js/app.templates.js'
    }
};
