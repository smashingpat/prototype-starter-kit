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
const argv = require('yargs').argv;

const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const stream = require('gulp-streamify')
const source = require('vinyl-source-stream')
const browserify = require('browserify')
const watchify = require('watchify')
const babelify  = require('babelify')

const browserSync = require('browser-sync')

const entry = './source/index.js'
const outfile = 'bundle.js'

const tasks = {
    sass: function sassTask() {

        return gulp.src('./source/global.scss')
            .pipe(plumber())
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
    script: function scriptTask(userSettings, callback) {

        const defaultSettings = {
            watch: false,
            entries: './source/*.js'
        }

        const settings = Object.assign({}, defaultSettings, userSettings);

        glob(settings.entries, (error, files) => {

            const streams = files.map(entry => {
                const filename = path.relative('./source/', entry);

                let b = browserify(entry, {
                    transform: babelify,
                })

                b = settings.watch ? watchify(b) : b

                const bundle = () => {
                    return b.bundle()
                        .on('error', function(err) {
                            browserSync.notify(`[<span style="color:red">Browserify</span>] ERROR`);
                            gutil.log(`[${gutil.colors.cyan('browserify')}] ${gutil.colors.red('Error:')}\n ${err} \n\n${err.codeFrame}`);
                            this.emit('end');
                        })
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
    server: function createServer(callback) {

        // dev server
        let server = browserSync({
            server: {
                baseDir: "./app/"
            },
            open: argv.open,
            port: argv.port ? argv.port : 3000,
        }, callback)

    },
    watch: function watchFiles(callback) {
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
