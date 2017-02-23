import gulp from 'gulp'
import watch from 'gulp-watch'
import browserSync from 'browser-sync'
import compression from 'compression'
import config from '../config'

function startServer(callback) {

    watch(config.files.dest.index + '/**/*.{html,jpg,png,gif,svg}', browserSync.reload)

    let server = browserSync({
        server: {
            baseDir: './app/',
            middleware: [
                config.gzip && compression(),
            ].filter(Boolean),
        },
        open: config.open,
        port: config.port,
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
                'text-shadow': '0 1px 2px',
            },
        },
    }, callback)
}

gulp.task('server', startServer)
