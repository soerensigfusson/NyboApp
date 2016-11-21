module.exports = function(grunt) {
    var path = require('path');

    // measures the time each task takes
    require('time-grunt')(grunt);

    var buildroot = 'public';

    var grunttask = grunt.cli.tasks[0];


    var data = {
        target: 'App',
        apppath: 'App',
        htmlpath: 'App/html',
        resourcespath: 'App/resources',
        buildroot: buildroot,
        tempapppath: 'Temp',
        buildresourcespath: buildroot,
    };

    grunt.loadNpmTasks('grunt-ng-constant');

    // load grunt config
    require('load-grunt-config')(grunt, {
        data: data,
        jitGrunt: {
            staticMappings: {
                ngAnnotate: 'grunt-ng-annotate'            }
        },
        configPath: path.join(process.cwd(), 'buildtools/grunttasks')
    });
};
