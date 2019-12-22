'use strict'

const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
module.exports = {
    // entry: './src/index.js', // 单一 entry
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        //filename: 'bundle_build_v2.js'
        filename: '[name].js'
       
    }, 
    //mode: 'production',
    mode: 'development',
    module: {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader'
            },
            {
                test: /.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                //use: 'file-loader'
                use: [{
                    loader: 'url-loader', // base64
                    options: {
                        limit: 10240
                    }
                }]
            },
            {
                test: /.(ttc|woff2)/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        function () {
            this.hooks.done.tap('done', (stat) => {
                if (stats.compilation.errors &&
                    stats.compilation.errors.length &&
                    process.argv.indexOf('--watch') == -1
                ) {
                    console.log('build error');
                    process.exit(1);
                    }
            })
        }
    ],
    devServer: {
        contentBase: './dist',
        hot: true,
        stats: 'errors-only'
    }
}