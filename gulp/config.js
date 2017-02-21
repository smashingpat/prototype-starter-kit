/*
    Config file
========================================== */
import { argv } from 'yargs'

export default {
    port: argv.port || 1337,
    open: argv.open || false,
    production: argv.production || false,
    beautify: argv.beautify || false,
    gzip: argv.gzip || false,
    hot: argv.hot || false,
    files: {
        dest: {
            index: `${__dirname}/../dist`,
        },
        source: {
            index: `${__dirname}/../source`,
            sass: `${__dirname}/../source/*.{sass,scss}`,
            js: `${__dirname}/../source/*.{js,jsx}`,
            yaml: `${__dirname}/../source/**/*.{yml,yaml}`,
        },
        watch: {
            sass: `${__dirname}/../source/**/*.{sass,scss}`,
            js: `${__dirname}/../source/**/*.{js,jsx}`,
            yaml: `${__dirname}/../source/**/*.{yml,yaml}`,
        },
    },
};
