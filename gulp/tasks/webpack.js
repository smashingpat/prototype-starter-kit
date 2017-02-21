import gulp from 'gulp';
import gutil from 'gulp-util';
import webpack from 'webpack';
import bs from 'browser-sync';
import webpackConfig from '../../webpack.config.babel';


export const compiler = webpack(webpackConfig);

export const messenger = (cb) => {
    let callback = cb;
    return (err, stats) => {
        gutil.log('[webpack]: compiling');
        if (err) {
            gutil.PluginError({
                plugin: 'webpack',
                message: err.stack || err,
            });
            return;
        }

        gutil.log(stats.toString({
            chunks: false,
            colors: true,
        }));

        bs.reload();

        if (typeof callback === 'function') {
            callback();
            callback = null;
        }
    };
};

gulp.task('webpack', (done) => {
    compiler.run(messenger(done));
});
gulp.task('webpack:watch', (done) => {
    compiler.watch({}, messenger(done));
});
