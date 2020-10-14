const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { env } = require("process");
let plugins=[
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: "index.html",
        chunks: ['index']
    }),
    new HtmlWebpackPlugin({
        template: './public/test.html',
        filename: "test.html",
        chunks: ['test']
    }),
];
if(process.env.NODE_ENV==="production"){
    plugins.push(new CopyWebpackPlugin({
        patterns: [{
            from: __dirname+'/public',
            to:__dirname+"/dist"
        }]
    }))
}
module.exports = {
    mode: 'development', //production
    devtool: 'cheap-module-source-map',
    entry: {
        index: "./src/index.js",
        test: "./src/test/index.js"
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
        publicPath: '/3Dplatform',
    },

    resolve: {   // 需要打包的文件后缀
        alias: {
            //修改Vue被导入的路径
            "@": path.resolve(__dirname, 'src'),
        },
        modules: ['node_modules'],
        extensions: [".tsx", ".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg|glb)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 7000000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }

        ]
    },
    plugins,
    devServer: {
        contentBase: 'public',
        hot: true,
        stats:"errors-only",
        // port: 80,
        disableHostCheck: true,
        // host:'0.0.0.0'
        proxy: {
            '/geoserver': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    },
    //代码分割
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    }
}