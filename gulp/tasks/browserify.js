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
const errorHandler = require('../utils/error-handler');
const config = require('../config');

function compileBrowserify(userSettings, callback) {

    const defaultSettings = {
        watch: false,
        entries: './source/*.js'
    }

    const settings = Object.assign({}, defaultSettings, userSettings);

    glob(settings.entries, (error, files) => {

        const streams = files.map(entry => {
            const filename = path.relative('./source/', entry);

            let lastBytes = 0;

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
                const kiloBytes = (bytes / 1000);
                const difference = () => {
                    const calc = `${bytes - lastBytes}`

                    if (calc > 0) {
                        return gutil.colors.bold.green('+' + calc)
                    } else if (calc < 0) {
                        return gutil.colors.bold.yellow(calc)
                    } else {
                        return gutil.colors.bold.white(calc)
                    }
                }
                gutil.log(`[${gutil.colors.bold.blue(`browserify`)}] compiled ${gutil.colors.bold(filename)} (${kiloBytes}kb) -> ${difference()} bytes`)
                lastBytes = bytes
            })

            return bundle()
        })

        es.merge(streams).on('end', callback)
    });

};


gulp.task('browserify', cb => compileBrowserify({}, cb))
gulp.task('browserify:watch', cb => compileBrowserify({watch: true}, cb))
