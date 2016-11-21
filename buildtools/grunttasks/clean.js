module.exports = {
    development: {
        src: ['<%= buildroot %>/**', '!**/config.xml'],
    },
    production: {
        src: ['<%= buildroot %>/**', '!**/config.xml'],
    },

    //Clean folder used to store ngAnnotated files before concat task
    tempfolder: {
        src: ['<%= tempapppath %>/**']
    }

};
