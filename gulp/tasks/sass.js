import gulp from 'gulp';
import gulpif from 'gulp-if';
import watch from 'gulp-watch';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import postcssAssets from 'postcss-assets';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import cssnano from 'cssnano';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import errorHandler from '../utils/error-handler';
import config from '../config';

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
            postcssAssets({
                loadPaths: ['**'],
                basePath: './app',
                cachebuster: true,
            }),
            autoprefixer({ browsers: ['last 1 version'] }),
            postcssImport(),
            cssnano({
                core: config.production,
                discardComments: {
                    removeAll: true,
                },
            }),
        ]))
        .pipe(gulpif(!config.production, sourcemaps.write()))
        .pipe(gulp.dest(config.files.dest.index))
        .pipe(browserSync.stream());
}

function watchFiles() {
    watch(config.files.watch.sass, compileSass);
    return compileSass();
}

gulp.task('sass', compileSass);
gulp.task('sass:watch', watchFiles);
