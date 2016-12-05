'use strict'

const gulp = require('gulp')
const gulpif = require('gulp-if')
const glob = require('glob')
const path = require('path')
const es = require('event-stream')
const gutil = require('gulp-util')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const watch = require('gulp-watch')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const argv = require('yargs').argv
const stripAnsi = require('strip-ansi')

const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const stream = require('gulp-streamify')
const source = require('vinyl-source-stream')
const browserify = require('browserify')
const watchify = require('watchify')
const babelify  = require('babelify')
const envify = require('envify/custom')

const browserSync = require('browser-sync')

const entry = './source/index.js'
const outfile = 'bundle.js'

const tasks = {
    errorHandler: function(errorObject, taskName) {
        const style = {
            pre: 'padding:1em;margin:-1em;background-color:#F44336;color:#FFF;',
            code: 'color:#FFF;word-wrap:break-word;font-family:monospace;'
        }
        let bsMessage = ''
        let logMessage = ''

        for (var index in errorObject) {
            if (errorObject.hasOwnProperty(index)) {
                if (errorObject[index]) {
                    bsMessage += `<u>${index}</u>` + ':\n' + errorObject[index] + '\n';
                    logMessage += index + ':\n' + errorObject[index] + '\n';
                }
            }
        }

        browserSync.notify(
            `<pre style='${style.pre}'><code style='${style.code}'>${stripAnsi(bsMessage)}</code></pre>`,
            300000
        );
        gutil.log(`${gutil.colors.red.bold(`error ${taskName}`)}:\n${logMessage}`)
        // this.emit('end')
    },
    sass: function() {

        return gulp.src('./source/global.scss')
            .pipe(plumber({
                errorHandler: (err) => tasks.errorHandler({
                    message: err.messageFormatted
                }, 'sass')
            }))
            .pipe(gulpif(!argv.production, sourcemaps.init()))
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
                        core: argv.production ? true : false,
                        discardComments: {
                            removeAll: true
                        }
                    })
                ]))
            .pipe(gulpif(!argv.production, sourcemaps.write()))
            .pipe(gulp.dest('./app'))
            .pipe(browserSync.stream())

    },
    script: function(userSettings, callback) {

        const defaultSettings = {
            watch: false,
            entries: './source/*.js'
        }

        const settings = Object.assign({}, defaultSettings, userSettings);

        glob(settings.entries, (error, files) => {

            const streams = files.map(entry => {
                const filename = path.relative('./source/', entry);

                let lastBytes = 0;

                let b = browserify(entry)
                    .transform(babelify)
                    .transform(envify({
                        NODE_ENV: argv.production ? 'production' : 'development'
                    }))

                b = settings.watch ? watchify(b) : b

                const bundle = () => {
                    return b.bundle()
                        .on('error', (err) => tasks.errorHandler({
                            file: err.filename,
                            message: err.message,
                            code: err.codeFrame
                        }, 'browserify'))
                        .pipe(source(filename))
                        .pipe(gulpif(argv.production, stream(uglify({
                            output: {
                                beautify: argv.beautify ? true : false
                            }
                        }))))
                        .pipe(gulp.dest('./app'))
                        .pipe(browserSync.stream())
                }

                b.on('update', bundle)
                b.on('bytes', bytes => {
                    const difference = () => {
                        const calc = `${bytes - lastBytes}`

                        if (calc > 0) {
                            return gutil.colors.bold.green('+' + calc)
                        } else if (calc < 0) {
                            return gutil.colors.bold.yellow(calc)
                        } else {
                            return gutil.colors.bold.white(calc)
                        }
                    }
                    gutil.log(`[${gutil.colors.bold.blue(`browserify`)}] compiled ${gutil.colors.bold(filename)} -> ${difference()} bytes`)
                    lastBytes = bytes
                })

                return bundle()
            })

            es.merge(streams).on('end', callback)
        });

    },
    server: function(callback) {

        // dev server
        let server = browserSync({
            server: {
                baseDir: "./app/"
            },
            open: argv.open,
            port: argv.port ? argv.port : 1337,
            notify: {
                styles: {
                    'background-color': '#212121',
                    'border-radius': '0px',
                    'color': '#FFF',
                    'padding': '1em',
                    'position': 'fixed',
                    'top': 'auto',
                    'right': 'auto',
                    'bottom': '0px',
                    'left': '0px',
                    'font-size': '11px',
                    'text-align': 'left',
                    'text-shadow': '0 1px 2px rgba(0,0,0,.4)'
                }
            }
        }, callback)

    },
    watch: function(callback) {
        watch(['app/**/*.{html,json}'], browserSync.reload)
        watch(['source/**/*.{scss,sass}'], tasks.sass)
        tasks.script({watch:true}, callback)
    }
}

gulp.task('sass', tasks.sass)
gulp.task('script', cb => tasks.script({}, cb))

gulp.task('watch', tasks.watch)
gulp.task('server', tasks.server)

gulp.task('serve', ['sass', 'watch', 'server'])
gulp.task('bundle', ['sass', 'script'])
