const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const dist = path.resolve(__dirname, 'public/dist');
const src = path.resolve(__dirname, 'public');

module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(src, 'app/index.ts'),
        chat: path.resolve(src, 'app/chat/chat.ts'),
    },

    output: {
        path: dist,
        filename: 'bundle.[name]-[hash].js',
    },

    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', ' ', '.scss'],
    },

    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['main'],
            filename: '../index.html',
            template: './public/template.html',
            inject: 'body',
        }),
        new HtmlWebpackPlugin({
            chunks: ['chat'],
            filename: '../app/chat/chat.html',
            template: './public/app/chat/template.html',
            inject: 'body',
        }),
        new MiniCssExtractPlugin({
            path: dist,
            filename: 'bundle.style.[name]-[hash].css',
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
            },
            {
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
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer({ browsers: ['Safari >= 8', 'last 2 versions'] })],
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },

};
