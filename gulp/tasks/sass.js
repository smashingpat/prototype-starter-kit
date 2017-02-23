import gulp from 'gulp'
import gulpif from 'gulp-if'
import watch from 'gulp-watch'
import plumber from 'gulp-plumber'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import sourcemaps from 'gulp-sourcemaps'
import browserSync from 'browser-sync'
import errorHandler from '../utils/error-handler'
import config from '../config'

function compileSass() {
    return gulp.src(config.files.source.sass)
        .pipe(plumber({
            errorHandler: errorHandler(['message'], 'sass'),
        }))
        .pipe(gulpif(!config.production, sourcemaps.init()))
        .pipe(sass({
            outputStyle: 'expanded',
        }))
        .pipe(postcss([
            require('postcss-assets')({
                loadPaths: ['**'],
                basePath: './app',
                cachebuster: true,
            }),
            require('autoprefixer')({ browsers: ['last 1 version'] }),
            require('postcss-import')(),
            require('cssnano')({
                core: config.production ? true : false,
                discardComments: {
                    removeAll: true,
                },
            }),
        ]))
        .pipe(gulpif(!config.production, sourcemaps.write()))
        .pipe(gulp.dest(config.files.dest.index))
        .pipe(browserSync.stream())
}

function watchFiles() {
    return watch(config.files.watch.sass, compileSass)
}

gulp.task('sass', compileSass)
gulp.task('sass:watch', watchFiles)
