'use strict';

const gulp = require('gulp');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const yaml = require('gulp-yaml');
const browserSync = require('browser-sync');
const config = require('../config');


function compileYaml() {
    return gulp.src(config.files.source.yaml)
        .pipe(plumber())
        .pipe(yaml())
        .pipe(gulp.dest(config.files.dest.index))
        .pipe(browserSync.stream())
}

function watchFiles() {
    return watch(config.files.watch.yaml, compileYaml);
}

gulp.task('yaml', compileYaml);
gulp.task('yaml:watch', watchFiles);
