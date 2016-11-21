module.exports = {

    options: {
        add: true,
        sourceMap: false
        //remove: true
    },

    dev: {

        files: [{
            expand: true,
            //Work on the source files
            cwd: '<%= apppath %>/',
            src: [
                '**/*.js',
                //Dont work on already minified files
                '!**/*.min.js',
                //Dont work on test files, as they do not need to be annotated
                '!**/*.test.js',
                //ignore resources
                '!resources/**'
            ],
            //Put results in a temp folder for further processing
            dest: '<%= tempapppath %>/'
        }]

    }

};
