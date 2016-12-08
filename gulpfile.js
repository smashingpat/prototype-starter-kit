'use strict';

const gulp = require('gulp');

require('./gulp/tasks/sass');
require('./gulp/tasks/yaml');
require('./gulp/tasks/browserify');
require('./gulp/tasks/browserSync');

gulp.task('serve', [
    'sass',
    'yaml',
    'browserify',
    'sass:watch',
    'yaml:watch',
    'browserify:watch',
    'server'
]);

gulp.task('bundle', [
    'sass',
    'yaml',
    'script'
]);
