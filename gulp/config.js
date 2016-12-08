/*
    Config file
========================================== */
const argv = require('yargs').argv;

module.exports = {
    port: argv.port || 1337,
    production: argv.production || false,
    beautify: argv.beautify || false,
    files: {
        dest: {
            index: './app',
        },
        source: {
            index: './source',
            sass: './source/*.{sass,scss}',
            js: './source/*.{js,jsx}',
            yaml: './source/**/*.{yml,yaml}',
        },
        watch: {
            sass: './source/**/*.{sass,scss}',
            js: './source/**/*.{js,jsx}',
            yaml: './source/**/*.{yml,yaml}',
        }
    },
}
