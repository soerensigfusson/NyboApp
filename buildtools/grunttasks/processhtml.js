module.exports = {
    dist: {
        files: [{
            expand: true,
            filter: 'isFile',
            cwd: '<%= htmlpath %>/',
            src: '*.html',
            dest: '<%= buildroot %>'
        }]
    }
}