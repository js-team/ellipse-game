var path = require('path');

module.exports = {
    entry: './dev/scripts/main.js',
    output: {
        path: './build/scripts/',
        filename: 'main.js'
    },
    watch: false,
    debug: true,
    devtool: 'inline-source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                presets: ['es2015']
            }
        }]
    },
    resolve: {
        alias: {
            jquery: path.resolve(__dirname, 'dev/scripts/lib/jquery-1.12.2.js'),
            d3: path.resolve(__dirname, 'dev/scripts/lib/d3.min.js')
        }
    }

};