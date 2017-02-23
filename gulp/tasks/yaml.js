import gulp from 'gulp'
import watch from 'gulp-watch'
import plumber from 'gulp-plumber'
import yaml from 'gulp-yaml'
import browserSync from 'browser-sync'
import config from '../config'


function compileYaml() {
    return gulp.src(config.files.source.yaml)
        .pipe(plumber())
        .pipe(yaml())
        .pipe(gulp.dest(config.files.dest.index))
        .pipe(browserSync.stream())
}

function watchFiles() {
    watch(config.files.watch.yaml, compileYaml)
    return compileYaml()
}

gulp.task('yaml', compileYaml)
gulp.task('yaml:watch', watchFiles)
