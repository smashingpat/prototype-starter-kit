/*
    Gulpfile.js
    -----------

    Imports tasks from ./gulp/tasks
    Config is stored from ./gulp/config.js
----------------------------------------------------------------------------- */

import gulp from 'gulp';
import config from './gulp/config';
import './gulp/tasks/clean';
import './gulp/tasks/copy';
import './gulp/tasks/sass';
import './gulp/tasks/yaml';
import './gulp/tasks/webpack';
import './gulp/tasks/browser-sync';

// set NODE_ENV to production/development
process.env.NODE_ENV = config.production ? 'production' : 'development';

/*
    Combine gulp tasks
------------------------------------------ */
gulp.task('serve', [
    'copy:watch',
    'webpack:watch',
    'sass:watch',
    'yaml:watch',
    'server',
]);

gulp.task('bundle', [
    'copy',
    'sass',
    'yaml',
    'webpack',
]);
