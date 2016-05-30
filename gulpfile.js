'use strict'

const gulp = require('gulp')
const plumber = require('gulp-plumber')
const watch = require('gulp-watch')
const gulpif = require('gulp-if')
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
    presets: ['es2015', 'react']
})

const entry = './source/index.js'
const outfile = 'bundle.js'


gulp.task('sass', function() {
    gulp.src('./source/sass/global.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            require('postcss-assets')({
                loadPaths: ['**'],
                basePath: './site',
                cachebuster: true
            }),
            require('autoprefixer')({ browsers: ['last 1 version'] }),
            require('csswring')()
        ]))
        .pipe(gulp.dest('./site'))
})

gulp.task('watch', ['sass'], function(callback) {

    // dev server
    let server = budo(entry, {
        serve: outfile,
        port: 3000,
        live: true,
        dir: './site',
        open: argv.open,
        browserify: {
            transform: babelify
        },
        stream: process.stdout
    }).on('exit', callback)

    // watch files
    watch(['source/sass/**/*.{scss,sass}'], () => gulp.start('sass'))
    watch(['./site/**/*.{html,json}'], () => server.reload())

})

gulp.task('script', function() {
    var bundler = browserify(entry, {
        transform: babelify
    }).bundle()

    return bundler
        .pipe(source('index.js'))
        .pipe(gulpif(argv.production, stream(uglify())))
        .pipe(rename(outfile))
        .pipe(gulp.dest('./site'))
})

gulp.task('bundle', ['sass', 'script'])
