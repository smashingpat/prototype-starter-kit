'use strict';

const gulp = require('gulp');
const gulpif = require('gulp-if');
const gutil = require('gulp-util');
const glob = require('glob');
const path = require('path');
const es = require('event-stream');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const envify = require('envify/custom');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const bytesToMegabytes = require('../utils/bytes-to-megabytes');
const merge = require('../utils/merge');
const errorHandler = require('../utils/error-handler');
const config = require('../config');


function createInstance(entry, settings) {
    const filename = path.relative('./source/', entry);
    let lastBytes = 0;

    settings = merge({
        watch: false,
    }, settings)

    let b = browserify(entry, {
        debug: !config.production,
    })
        .transform(babelify)
        .transform(envify({
            NODE_ENV: config.production ? 'production' : 'development'
        }))

    b = settings.watch ? watchify(b) : b

    const bundle = () => {
        return b.bundle()
            .on('error', errorHandler(['filename', 'message', 'codeFrame'], 'browserify'))
            .pipe(source(filename))
            .pipe(buffer())
            .pipe(gulpif(!config.production, sourcemaps.init({ loadMaps: true })))
            .pipe(gulpif(config.production, uglify({
                output: {
                    beautify: config.beautify ? true : false
                }
            })))
            .pipe(gulpif(!config.production, sourcemaps.write()))
            .pipe(gulp.dest('./app'))
            .pipe(browserSync.stream())
    }

    b.on('update', bundle)
    b.on('bytes', bytes => {
        const megaBytes = bytesToMegabytes(bytes).toFixed(2)
        const difference = () => {
            const difference = bytesToMegabytes(bytes - lastBytes).toFixed(2)

            if (difference > 0) {
                return gutil.colors.bold.green('+' + difference)
            } else if (difference < 0) {
                return gutil.colors.bold.yellow(difference)
            } else {
                return gutil.colors.bold.white(difference)
            }
        }

        gutil.log(`[${gutil.colors.bold.blue(`browserify`)}] compiled ${gutil.colors.bold(filename)} (${megaBytes}mb) -> ${difference()}mb`)
        lastBytes = bytes
    })

    return bundle()
}

function compileBrowserify(settings) {

    settings = merge({
        watch: false,
        entries: './source/*.js'
    }, settings);

    return function(callback) {
        glob(settings.entries, (error, files) => {
            const streams = files.map(entry => createInstance(entry, settings));

            es.merge(streams).on('end', callback);
        });
    }

};


gulp.task('browserify', compileBrowserify())
gulp.task('browserify:watch', compileBrowserify({watch: true}))
