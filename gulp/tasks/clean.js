import gulp from 'gulp'
import clean from 'gulp-clean'
import config from '../config'


function deleteDist() {
    return gulp.src(`${config.files.dest.index}/**/*`)
        .pipe(clean())
}


gulp.task('clean', deleteDist)
