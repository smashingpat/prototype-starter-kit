/*
    Gulpfile.js
    -----------

    Imports tasks from ./gulp/tasks
    Config is stored from ./gulp/config.js
----------------------------------------------------------------------------- */

import gulp from 'gulp';

/*
    Tasks imports
------------------------------------------ */
import './gulp/tasks/sass';
import './gulp/tasks/yaml';
import './gulp/tasks/browserify';
import './gulp/tasks/browserSync';

/*
    Combine gulp tasks
------------------------------------------ */
gulp.task('serve', [
    'sass',
    'yaml',
    'browserify',
    'sass:watch',
    'yaml:watch',
    'browserify:watch',
    'server',
]);

gulp.task('bundle', [
    'sass',
    'yaml',
    'browserify',
]);
