'use strict';

const gulp = require('gulp');
const watch = require('gulp-watch');
const browserSync = require('browser-sync');
const config = require('../config');

function startServer(callback) {
    // watch files and reload on change
    watch(config.files.dest.index + '/**/*.{html,jpg,png,gif,svg}', browserSync.reload);

    let server = browserSync({
        server: {
            baseDir: "./app/"
        },
        open: config.open,
        port: config.port,
        notify: {
            styles: {
                'background-color': '#212121',
                'border-radius': '0px',
                'color': '#FFF',
                'padding': '1em',
                'position': 'fixed',
                'top': 'auto',
                'right': 'auto',
                'bottom': '0px',
                'left': '0px',
                'font-size': '11px',
                'text-align': 'left',
                'text-shadow': '0 1px 2px rgba(0,0,0,.4)'
            }
        }
    }, callback)
}

gulp.task('server', startServer);
