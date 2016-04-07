const gulp = require('gulp')
const watch = require('gulp-watch')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const streamify = require('gulp-streamify')
const source = require('vinyl-source-stream')
const budo = require('budo')
const browserify = require('browserify')
const babelify  = require('babelify').configure({
    presets: ['es2015']
})

const argv = require('yargs').argv;

const entry = './source/index.js'
const outfile = 'bundle.js'

gulp.task('sass', function() {
    gulp.src('./source/sass/global.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app'))
})

gulp.task('watch', ['sass'], function(cb) {
    //watch SASS
    watch(['source/sass/*.scss'], () => gulp.start('sass'))

    //dev server
    budo(entry, {
        serve: outfile,
        stream: process.stdout,
        live: true,
        dir: 'app',
        open: argv.open,
        browserify: {
            transform: babelify
        }
    }).on('exit', cb)
})

//the distribution bundle task
gulp.task('bundle', ['sass'], function() {
    var bundler = browserify(entry, {
        transform: babelify
    }).bundle()

    return bundler
        .pipe(source('index.js'))
        .pipe(streamify(uglify()))
        .pipe(rename(outfile))
        .pipe(gulp.dest('./app'))
})
