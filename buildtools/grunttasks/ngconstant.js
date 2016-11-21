module.exports = {
    options: {
        name: 'App.Constants',
        wrap: '"use strict";\n\n{%= __ngModule %}',
        space: '  ',
        dest: '<%= buildresourcespath %>/js/app.constants.js',
    },

    development: {
        constants: {
            APISERVER: "."
        }
    },

    production: {
        constants: {
            APISERVER: "http://localhost:1508"
        }
    }
};
