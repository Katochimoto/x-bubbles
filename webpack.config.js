var path = require('path');
var webpack = require('webpack');
var merge = require('lodash/merge');

var srcPath = path.join(__dirname, 'src');
var distPath = path.join(__dirname, 'dist');
var isDev = (process.env.NODE_ENV === 'development');

var params = {
    'debug': false,
    'devtool': undefined,
    'target': 'web',
    'entry': {
        'x-bubbles': './index.js'
    },
    'context': srcPath,
    'output': {
        'filename': '[name]-compact.js',
        'library': 'XBubbles',
        'libraryTarget': 'var',
        'path': distPath
    },
    'externals': {
        'modernizr': {
            'var': 'Modernizr',
            'root': 'modernizr',
            'commonjs2': 'modernizr',
            'commonjs': 'modernizr',
            'amd': 'modernizr'
        }
    },
    'module': {
        'preLoaders': [
            {
                'test': /\.js$/,
                'loader': 'eslint',
                'include': [ srcPath ]
            }
        ],
        'loaders': [
            {
                'test': /\.js$/,
                'loader': 'babel',
                'include': [ srcPath ]
            },
            {
                'test': /\.modernizrrc$/,
                'loader': 'modernizr'
            }
        ]
    }
};

var runs = [
    params
];

runs.push(merge({}, params, {
    'output': {
        'filename': '[name].js',
    },
    'resolve': {
        'alias': {
            'modernizr$': path.resolve(__dirname, '.modernizrrc')
        }
    },
    'externals': null
}));

if (!isDev) {
    var prodParams = merge({}, params, {
        'output': {
            'filename': '[name]-compact.min.js',
        },
        'plugins': [
            new webpack.optimize.UglifyJsPlugin({
                'output': {
                    'comments': false
                },
                'compress': {
                    'warnings': false
                }
            })
        ],
        'devtool': '#source-map'
    });

    runs.push(prodParams);

    runs.push(merge({}, prodParams, {
        'output': {
            'filename': '[name].min.js',
        },
        'resolve': {
            'alias': {
                'modernizr$': path.resolve(__dirname, '.modernizrrc')
            }
        },
        'externals': null
    }));
}

module.exports = runs;
