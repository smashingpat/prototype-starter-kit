/*
    Config file
========================================== */
import { argv } from 'yargs';

export default {
    port: argv.port || 1337,
    open: argv.open || false,
    production: argv.production || false,
    beautify: argv.beautify || false,
    gzip: argv.gzip || false,
    files: {
        dest: {
            index: './dist',
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
        },
    },
}
