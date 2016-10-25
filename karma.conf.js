// Karma configuration
// Generated on Tue Oct 25 2016 12:04:58 GMT+0200 (CEST)

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: [
            'mocha',
            'browserify'
        ],
        files: [
            { pattern: 'test/**/*.js', included: true }
        ],
        exclude: [],
        preprocessors: {
        'test/**/*.js': ['browserify']
        },
        browserify: {
            debug: true,
            transform: [ 'babelify' ]
        },
        reporters: ['mocha'],
        port: 9876,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome', 'Firefox', 'Safari', 'IE'],
        singleRun: false,
        concurrency: Infinity
    })
}
