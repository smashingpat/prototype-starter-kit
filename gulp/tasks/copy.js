import gulp from 'gulp';
import watch from 'gulp-watch';
import plumber from 'gulp-plumber';
import config from '../config';


const glob = [
    `${config.files.source.index}/**/*`,
    `!${config.files.source.index}/**/*.{js,scss,sass,yml,yaml}`,
];

function copyFiles() {
    return gulp.src(glob, { nodir: true })
        .pipe(gulp.dest(config.files.dest.index));
}

function watchFiles() {
    watch(glob, copyFiles);
    return copyFiles();
}

gulp.task('copy', copyFiles);
gulp.task('copy:watch', watchFiles);
