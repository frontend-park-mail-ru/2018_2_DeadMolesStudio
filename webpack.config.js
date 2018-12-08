var path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: [
        './public/app/index.js',
        // './public/css/style.scss',
    ],
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'public/dist'),
        filename: 'bundle.[hash].js',
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './public/template.html',
            inject: 'body',
        }),
        // new ExtractTextPlugin({
        //     filename: './public/css/style.bundle.css',
        // }),
    ],
    resolve: {
        extensions: ['.ts', ' '],
    },
    module: {
        rules: [
            // {
            //     test: /\.css$/,
            //     exclude: /node_modules/,
            //     use: [
            //         {
            //             loader: 'style-css',
            //         }, {
            //             loader: 'css-loader',
            //             options: {
            //                 importLoaders: 1,
            //             },
            //         },
            //     ],
            // },

            {
                test: /\.scss$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'public/css'),
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'style-loader',
                        }, {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        }, {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [autoprefixer({ browsers: ['Safari >= 8', 'last 2 versions'] })],
                                sourceMap: true,
                            },
                        },
                    ],
                }),
            },

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
            },
        ],
    },
};
