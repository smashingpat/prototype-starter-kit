'use strict';

const gulp = require('gulp');
const gulpif = require('gulp-if');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const errorHandler = require('../utils/error-handler');
const config = require('../config');


function compileSass() {

    return gulp.src(config.files.source.sass)
        .pipe(plumber({
            errorHandler: errorHandler(['message'], 'sass')
        }))
        .pipe(gulpif(!config.production, sourcemaps.init()))
            .pipe(sass({
                outputStyle: 'expanded'
            }))
            .pipe(postcss([
                require('postcss-assets')({
                    loadPaths: ['**'],
                    basePath: './app',
                    cachebuster: true
                }),
                require('autoprefixer')({ browsers: ['last 1 version'] }),
                require('postcss-import')(),
                require('cssnano')({
                    core: config.production ? true : false,
                    discardComments: {
                        removeAll: true
                    }
                })
            ]))
        .pipe(gulpif(!config.production, sourcemaps.write()))
        .pipe(gulp.dest(config.files.dest.index))
        .pipe(browserSync.stream());
}

function watchFiles() {
    return watch(config.files.watch.sass, compileSass);
}

gulp.task('sass', compileSass);
gulp.task('sass:watch', watchFiles);
