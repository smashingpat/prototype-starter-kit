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
    errorHandler: function(err) {
        const style = 'padding:1em;margin:-1em;background-color:#F44336;'

        browserSync.notify(
            `<pre style='${style}'><code>${stripAnsi(err.message)}</code></pre>`,
            3000
        );
        gutil.log(`${gutil.colors.red('error')}: ${err.message}`)
        this.emit('end')
    },
    sass: function() {

        return gulp.src('./source/global.scss')
            .pipe(plumber({
                errorHandler: tasks.errorHandler
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

                let b = browserify(entry)
                    .transform(babelify)
                    .transform(envify({
                        NODE_ENV: argv.production ? 'production' : 'development'
                    }))

                b = settings.watch ? watchify(b) : b

                const bundle = () => {
                    return b.bundle()
                        .on('error', tasks.errorHandler)
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
                b.on('log', gutil.log)

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
            port: argv.port ? argv.port : 3000,
            notify: {
                styles: {
                    'background-color': '#212121',
                    'border-radius': '0px',
                    'color': 'white',
                    'padding': '1em',
                    'position': 'fixed',
                    'top': 'auto',
                    'right': 'auto',
                    'bottom': '0px',
                    'left': '0px',
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
