var grunt = require('grunt');

var options = {
    sourceMap: true,
};

var grunttask = grunt.cli.tasks[0];

if (grunttask === 'build') {
    options.sourceMap = false;
}

module.exports = {
    options: options,
    core: {
        src: [
            'node_modules/babel-polyfill/dist/polyfill.js',

            '<%= resourcespath %>/js/libs/hammer.js',
            '<%= resourcespath %>/js/libs/moment.js',
            '<%= resourcespath %>/js/libs/angular.js',
            '<%= resourcespath %>/js/libs/angular-loader.js',
            '<%= resourcespath %>/js/libs/angular-animate.js',
            '<%= resourcespath %>/js/libs/angular-aria.js',
            '<%= resourcespath %>/js/libs/angular-messages.js',
            '<%= resourcespath %>/js/libs/angular-sanitize.js',
            '<%= resourcespath %>/js/libs/angular-hammer.js',
            '<%= resourcespath %>/js/libs/angular-nvd3.min.js',
            '<%= resourcespath %>/js/libs/ngStorage.js',
            '<%= resourcespath %>/js/libs/ng-cordova.js',

            '<%= resourcespath %>/js/libs/angular-ui-router.js',

            '<%= resourcespath %>/js/libs/angular-locale_da-dk.js',

            '<%= resourcespath %>/js/libs/angular-material.js',

        ],
        dest: '<%= buildresourcespath %>/js/core.js',
    },

    //Working from tempapppath because that is where ngAnnotate saves its modified files
    application: {
        src: [
            //Main App definition
            '<%= tempapppath %>/App.Modules.js',
            '<%= tempapppath %>/App.Routes.js',
            //Other modules definitions
            '<%= tempapppath %>/**/*.Routes.js',

            //all files in app
            '<%= tempapppath %>/**/*.js',

            //Except unit test files
            '!<%= tempapppath %>/**/*.test.js',

            //Except unit test files
            '!<%= tempapppath %>/**/*.test.js',
        ],
        dest: '<%= buildresourcespath %>/js/app.js',

    }

};
