module.exports = {
    options: {
        config: '<%= package.configs %>/csscomb/csscomb-config.json'
    },
    test: {
        files: [{
            expand: true,
            filter: 'isFile',
            cwd: '.',
            src: ['App/resources/sass/**/*.scss', '<%= resourcespath %>/js/app/Components/**/*.scss'],
            dest: '.'
        }]
    }
};
