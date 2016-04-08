const gulp = require('gulp')
const watch = require('gulp-watch')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')

const budo = require('budo')
const argv = require('yargs').argv;
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const stream = require('gulp-streamify')
const source = require('vinyl-source-stream')
const browserify = require('browserify')
const babelify  = require('babelify').configure({
    presets: ['es2015']
})

const entry = './source/index.js'
const outfile = 'bundle.js'

gulp.task('sass', function() {
    gulp.src('./source/sass/global.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            require('autoprefixer')({ browsers: ['last 1 version'] }),
            require('csswring')()
        ]))
        .pipe(gulp.dest('./app'))
})

gulp.task('watch', ['sass'], function(callback) {
    // watch sass
    watch(['source/sass/*.scss'], () => gulp.start('sass'))

    // dev server
    budo(entry, {
        serve: outfile,
        live: true,
        dir: 'app',
        open: argv.open,
        browserify: {
            transform: babelify
        },
        stream: process.stdout
    }).on('exit', callback)
})

gulp.task('bundle', ['sass'], function() {
    var bundler = browserify(entry, {
        transform: babelify
    }).bundle()

    return bundler
        .pipe(source('index.js'))
        .pipe(stream(uglify()))
        .pipe(rename(outfile))
        .pipe(gulp.dest('./app'))
})
