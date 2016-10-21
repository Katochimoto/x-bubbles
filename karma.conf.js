var path = require('path');
var webpack = require('webpack');
var src = path.join(__dirname, 'src');

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [ 'mocha', 'sinon-chai' ],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/document-register-element/build/document-register-element.js',
            'test/helpers/setup.js',
            'test/spec/**/*.js'
        ],

        // list of files to exclude
        exclude: [

        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/**/*.js': [ 'webpack', 'sourcemap' ],
            'src/**/*.js': [ 'webpack', 'sourcemap' ]
        },

        webpack: {
            'devtool': '#inline-source-map',
            'module': {
                'loaders': [
                    {
                        'test': /\.js$/,
                        'loader': 'babel',
                        'include': [
                            path.join(__dirname, 'src'),
                            path.join(__dirname, 'test')
                        ]
                    }
                ],
                'postLoaders': [
                    {
                        'test': /\.js$/,
                        'loader': 'istanbul-instrumenter',
                        'include': [
                            path.join(__dirname, 'src')
                        ]
                    }
                ]
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [ 'progress', 'coverage' ],

        coverageReporter: {
            reporters : [
                // { type: 'text' },
                { type: 'lcov', dir: 'coverage', subdir: 'report' }
            ]
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        customLaunchers: {
            'ChromiumES6': {
                base: 'Chromium',
                flags: ['--enable-javascript-harmony']
            }
        },

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'PhantomJS',
            'Chromium'
        ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
