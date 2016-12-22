import gulp from 'gulp';
import gulpif from 'gulp-if';
import gutil from 'gulp-util';
import glob from 'glob';
import path from 'path';
import es from 'event-stream';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import envify from 'loose-envify/custom';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';
import bytesToMegabytes from '../utils/bytes-to-megabytes';
import merge from '../utils/merge';
import errorHandler from '../utils/error-handler';
import config from '../config';


function createInstance(entry, params) {
    const filename = path.relative('./source/', entry);
    const defaultSettings = {
        watch: false,
    };
    const settings = merge(defaultSettings, params);

    let lastBytes = 0;

    const b = browserify({
        entries: entry,
        debug: !config.production,
        cache: {},
        packageCache: {},
        transform: [
            babelify,
            envify()
        ],
        plugin: [
            settings.watch && watchify
        ].filter(Boolean),
    });

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
            .pipe(browserSync.stream());
    }

    const bytes = (bytes) => {
        const megaBytes = bytesToMegabytes(bytes).toFixed(2);
        const difference = () => {
            const difference = bytesToMegabytes(bytes - lastBytes).toFixed(2);

            if (difference > 0) {
                return gutil.colors.bold.green('+' + difference);
            } else if (difference < 0) {
                return gutil.colors.bold.yellow(difference);
            } else {
                return gutil.colors.bold.white(difference);
            }
        }

        gutil.log(`[${gutil.colors.bold.blue(`browserify`)}] compiled ${gutil.colors.bold(filename)} (${megaBytes}mb) -> ${difference()}mb`);
        lastBytes = bytes;
    }

    b.on('update', bundle);
    b.on('bytes', bytes);

    return bundle();
}

function compileBrowserify(params) {
    const defaultSettings = {
        watch: false,
        entries: './source/*.js'
    };
    const settings = merge(defaultSettings, params);

    return function(callback) {
        glob(settings.entries, (error, files) => {
            const streams = files.map(entry => createInstance(entry, settings));

            es.merge(streams).on('end', callback);
        })
    };
}


gulp.task('browserify', compileBrowserify());
gulp.task('browserify:watch', compileBrowserify({ watch: true }));
