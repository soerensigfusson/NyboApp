module.exports = {
    resources: {
        files: [{
            expand: true,
            cwd: '<%= resourcespath %>/images/',
            src: ['*.{png,svg}'],
            dest: '<%= buildresourcespath %>/images/'
        }, {
            expand: true,
            cwd: '<%= resourcespath %>/fonts/',
            src: ['**/*.woff', '**/*.woff2'],
            dest: '<%= buildresourcespath %>/fonts/'
        }, {
            expand: true,
            cwd: '<%= resourcespath %>/icons/',
            src: ['*.svg'],
            dest: '<%= buildresourcespath %>/icons/'
        }, {
            expand: true,
            cwd: '<%= resourcespath %>/lang/',
            src: ['*.json'],
            dest: '<%= buildresourcespath %>/lang/'
        }]
    },
    html: {
        files: [{
            //HTML
            expand: true,
            cwd: '<%= htmlpath %>/',
            src: ['**/*.html'],
            dest: '<%= buildroot %>'
        }]
    },
    js: {
        files: [{
            //HTML
            expand: true,
            cwd: '<%= resourcespath %>/js/',
            src: ['bootstrap*.js'],
            dest: '<%= buildresourcespath %>/js/'
        }]
    }


};
