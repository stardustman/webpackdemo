'use strict'

const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const setMPA = () => {
    const entry = {}
    const htmlWebpackPlugins = []
    // 匹配所有的入口文件 index.js
    const entryFiles = glob.sync(path.join(__dirname,'./src/*/index.js'))
    console.log('entryFile========>', entryFiles)
    Object.keys(entryFiles).map((index) => {
        const entryFile = entryFiles[index]
        console.log("entry file=====>", entryFile)
        // 极客时间怎么了，视频教程的正则写的有问题。视频里转义 ( 有错误
        const match = entryFile.match(/src\/(.*)\/index\.js/)
        console.log('page name======>', match)

        const pageName = match && match[1]
        entry[pageName] = entryFile

        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
               
                template: path.join(__dirname, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [ pageName],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false
                }
            })
        );
    })
    return {
        entry,
        htmlWebpackPlugins
    }
}

// multi-page app
// 解构赋值
const { entry, htmlWebpackPlugins } = setMPA();


module.exports = {
    // entry: './src/index.js', // 单一 entry
    // entry: {
    //     index: './src/index.js',
    //     search: './src/search.js'
    // },
    entry: entry,
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
        new CleanWebpackPlugin()
    ].concat(htmlWebpackPlugins),
    devServer: {
        contentBase: './dist',
        hot: true
    },
    devtool: 'source-map'
}