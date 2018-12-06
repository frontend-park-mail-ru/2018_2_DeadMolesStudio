var path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './public/app/index.js',
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
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer({ browsers: ['Safari >= 8', 'last 2 versions'] })],
                        },
                    },
                ],
            },
        ],
    },
};
