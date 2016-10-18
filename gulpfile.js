'use strict'

const gulp = require('gulp')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const watch = require('gulp-watch')
const gulpif = require('gulp-if')
const jade = require('gulp-jade')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const budo = require('budo')
const argv = require('yargs').argv;
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const stream = require('gulp-streamify')
const source = require('vinyl-source-stream')
const browserify = require('browserify')
const babelify  = require('babelify')

const entry = './source/index.js'
const outfile = 'bundle.js'

const browserifyConfig = {
    transform: babelify.configure({
        presets: ['es2015', 'react'],
        plugins: ['transform-object-rest-spread']
    })
}

const tasks = {
    jade: function jadeTask() {

        return gulp.src([
            './source/jade/**/*.jade',
            '!./source/jade/layouts/**/*.jade',
            '!./source/jade/includes/**/*.jade'
        ])
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./app'))

    },
    sass: function sassTask() {

        return gulp.src('./source/sass/global.scss')
            .pipe(plumber())
            .pipe(gulpif(!argv.production, sourcemaps.init()))
                .pipe(sass())
                .pipe(postcss([
                    require('postcss-assets')({
                        loadPaths: ['**'],
                        basePath: './app',
                        cachebuster: true
                    }),
                    require('autoprefixer')({ browsers: ['last 1 version'] }),
                    require('csswring')()
                ]))
            .pipe(gulpif(!argv.production, sourcemaps.write()))
            .pipe(gulp.dest('./app'))

    },
    script: function scriptTask() {

        var bundler = browserify(entry, browserifyConfig).bundle()

        return bundler
            .pipe(source('index.js'))
            .pipe(gulpif(argv.production, stream(uglify({
                output: {
                    beautify: argv.beautify ? true : false
                },
                compress: {
                    global_defs: {
                        __DEV__: false
                    }
                }
            }))))
            .pipe(rename(outfile))
            .pipe(gulp.dest('./app'))

    },
    server: function createServer(callback) {

        // dev server
        let server = budo(entry, {
            serve: outfile,
            port: argv.port ? argv.port : 3000,
            live: true,
            dir: './app',
            open: argv.open,
            browserify: browserifyConfig,
            stream: process.stdout
        }).on('exit', callback)

        // watch files
        watch(['source/sass/**/*.{scss,sass}'], tasks.sass)
        watch(['source/jade/**/*.jade'], () tasks.jade)

    },
}

gulp.task('jade', tasks.jade)
gulp.task('sass', tasks.sass)
gulp.task('script', tasks.script)

gulp.task('watch', ['jade', 'sass'], tasks.server)
gulp.task('bundle', ['jade', 'sass', 'script'])
