var grunt = require('grunt');


var watchApp = {

    /*APP SPECIFICS*/
    images: {
        files: ['<%= resourcespath %>/images/**/*.{png,jpg,gif,svg}'],
        tasks: ['newer:copy:resources'],
        options: {
            livereload: true
        },
    },
    icon: {
        files: ['<%= resourcespath %>/icons/**/*.{svg}'],
        tasks: ['newer:copy:resources'],
        options: {
            livereload: true
        },
    },
    scss: {
        files: ['<%= resourcespath %>/sass/**/*.scss', '<%= apppath %>/Components/**/*.scss', '<%= apppath %>/Pages/**/*.scss', '<%= apppath %>/Filters/**/*.scss'],
        tasks: ['newer:csscomb', 'sass:development', 'postcss:development'],
        options: {
            livereload: true
        },
    },
    js: {
        files: ['<%= apppath %>/**/*.js', 'apps/**/*.js'],
        tasks: ['ngAnnotate:dev:newer', 'babel', 'concat:application', 'uglify:application'],
        options: {
            livereload: true
        },
    },
    languages: {
        files: ['<%= resourcespath %>/lang/*.json'],
        tasks: ['copy:resources:new'],
        options: {
            livereload: true
        },
    },
    templates: {
        files: ['<%= apppath %>/**/*.html', '!<%= apppath %>/html/index.html'],
        tasks: ['html2js:templates', 'uglify:templates'],
        options: {
            livereload: true
        },
    },
    html: {
        files: ['<%= htmlpath %>/**/*.html'],
        tasks: ['copy:html'],
        options: {
            livereload: true,
        }
    }
};

module.exports = watchApp;
