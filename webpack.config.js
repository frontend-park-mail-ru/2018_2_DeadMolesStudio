const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const dist = path.resolve(__dirname, 'public/dist');
const src = path.resolve(__dirname, 'public');

module.exports = {
    mode: 'development',
    entry: [
        path.resolve(src, 'app/index.ts'),
    ],

    output: {
        path: dist,
        filename: 'bundle.[hash].js',
    },

    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', ' ', '.scss'],
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './public/template.html',
            inject: 'body',
        }),
        new MiniCssExtractPlugin({
            path: dist,
            filename: './bundle.style.[hash].css',
        }),
    ],

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            },
            {
                test: /\.(pug|jade)$/,
                loader: 'pug-loader',
                options: {
                    pretty: true,
                },
            }, {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                        },
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
        ],
    },

};

//                         // {
//                         //     loader: 'postcss-loader',
//                         //     options: {
//                         //         plugins: () => [autoprefixer({ browsers: ['Safari >= 8', 'last 2 versions'] })],
//                         //         sourceMap: true,
//                         //     },

