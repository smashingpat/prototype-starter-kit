import path from 'path';
import webpack from 'webpack';
import glob from 'glob';
import config from './gulp/config';


const globString = config.files.source.js;

const entries = glob.sync(globString).reduce((acc, file) => {
    const basename = path.basename(file).split('.').slice(0,-1).join('.');

    acc[basename] = [
        config.hot && 'webpack-hot-middleware/client?reload=true',
        file,
    ].filter(Boolean);

    return acc;
}, {});

export default {
    entry: {
        ...entries,
    },
    output: {
        path: config.files.dest.index,
        filename: '[name].js',
        publicPath: '/',
    },
    plugins: [
        config.hot && new webpack.optimize.OccurrenceOrderPlugin(),
        config.hot && new webpack.HotModuleReplacementPlugin(),
        config.hot && new webpack.NoEmitOnErrorsPlugin(),
        config.production && new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: { screw_ie8 : true },
            compress: { screw_ie8: true, warnings: false },
            comments: false,
        }),
    ].filter(Boolean),
    module: {
        loaders: [
            {test: /.jsx?$/, loader: 'babel-loader', exclude: /node_modules/},
        ],
    },
    devtool: 'source-map',
};
