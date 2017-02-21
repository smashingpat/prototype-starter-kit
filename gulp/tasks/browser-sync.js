import gulp from 'gulp';
import watch from 'gulp-watch';
import browserSync from 'browser-sync';
import compression from 'compression';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { compiler } from './webpack';
import config from '../config';
import webpackConfig from '../../webpack.config.babel';

function startServer(callback) {
    watch(`${config.files.dest.index}/**/*.{html,jpg,png,gif,svg}`, browserSync.reload);

    const server = browserSync({
        server: {
            baseDir: `${config.files.dest.index}/`,
            middleware: [
                config.hot && webpackDevMiddleware(compiler, {
                    noInfo: true,
                    quiet: false,
                    publicPath: webpackConfig.output.publicPath,
                }),
                config.hot && webpackHotMiddleware(compiler),
                config.gzip && compression(),
            ].filter(Boolean),
        },
        open: config.open,
        port: config.port,
        notify: {
            styles: {
                backgroundColor: '#212121',
                borderRadius: '0px',
                color: '#FFF',
                padding: '1em',
                position: 'fixed',
                top: 'auto',
                right: 'auto',
                bottom: '0px',
                left: '0px',
                fontSize: '11px',
                textAlign: 'left',
                textShadow: '0 1px 2px',
            },
        },
    }, callback);

    return server;
}

gulp.task('server', startServer);
