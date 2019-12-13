'use strict'

const webpack = require('webpack')
const glob = require('glob')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 自动清理 dist
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')


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
                chunks: [ 'vendors', pageName],
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
    //     // index: './src/index.js',
    //     // search: './src/search.js'
    //     index: './src/index/index.js',
    //     search: './src/search/index.js'
    // },

    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        //filename: 'bundle_build_v2.js'
        filename: '[name]_[chunkhash:8].js'
       
    }, 
    mode: 'production', //默认开启 tree-shaking
    //mode: 'development',
    //mode: 'none', //没有 tree-shaking
    module: {
        rules: [
            {
                test: /.js$/,
                use: 'babel-loader'
            },
            {
                test: /.css$/,
                use: [
                    //'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
                 
            },
            {
                test: /.less$/,
                use: [
                    //'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                // 自动补齐 css3 前缀
                                require('autoprefixer')({
                                    browsers : ['last 2 version','>1%', 'ios 7']
                               
                            })

                            ]
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75,
                            remPrecision: 8
                        }
                    }
                ]

            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                //use: 'file-loader'
                use: [{
                    loader: 'file-loader', // base64
                    options: {
                        name: '[name]_[hash:8].[ext]'
                    }
                }]
            },
            {
                test: /.(ttc|woff2)/,
                use: [{
                    loader: 'file-loader', // base64
                    options: {
                        name: '[name]_[hash:8][ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        
        // html 文件压缩
        // new HtmlWebpackPlugin({
        //     template: path.join(__dirname, 'src/search/index.html'),
        //     filename: 'search.html',
        //     chunks: ['search'],
        //     inject: true,
        //     minify: {
        //         html5: true,
        //         collapseWhitespace: true,
        //         preserveLineBreaks: false,
        //         minifyCSS: true,
        //         minifyJS: true,
        //         removeComments: false
        //     }
        // }),
        // new HtmlWebpackPlugin({
        //     template: path.join(__dirname, 'src/index/index.html'),
        //     filename: 'index.html',
        //     chunks: ['index'],
        //     inject: true,
        //     minify: {
        //         html5: true,
        //         collapseWhitespace: true,
        //         preserveLineBreaks: false,
        //         minifyCSS: true,
        //         minifyJS: true,
        //         removeComments: false
        //     }
        // }),

        new CleanWebpackPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),

        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //        {
        //         module: 'react',
        //         entry: 'http://11.url.cn/now/lib/16.2.0/react.min.js',
        //         global: 'React'
        //         },
        //         {
        //             module: 'react-dom',
        //             entry: 'http://11.url.cn/now/lib/16.2.0/react-dom.min.js',
        //             global: 'ReactDOM'
        //           },
        //     ],
        //   })
    ].concat(htmlWebpackPlugins),
    optimization: {
   
        splitChunks: {
            minSize: 0, // 要提取的文件大小
            cacheGroups: {
                commons: {
                    //test: /(react|react-dom)/,
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 3
              }
          }
      }  
    },
    devtool: 'inline-source-map'
}