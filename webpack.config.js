const path = require('path');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

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
        publicPath: '/dist/',
    },

    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', ' ', '.js', '.scss'],
        alias: {
            components: path.resolve(src, 'app', 'components/'),
            game: path.resolve(src, 'app', 'game/'),
            modules: path.resolve(src, 'app', 'modules/'),
            services: path.resolve(src, 'app', 'services/'),
            views: path.resolve(src, 'app', 'views/'),
        },
    },

    optimization: {
        minimize: true,
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
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /.css$/g,
            cssProcessor: cssnano,
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true,
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
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader?limit=100000',
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },

};
