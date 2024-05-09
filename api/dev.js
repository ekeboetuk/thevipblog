const webpack = require("webpack");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackDevMiddleware = require("webpack-dev-middleware");
const config = require("../config/webpack.config");
const webpackConfig = config({development:true});

const compiler = webpack(webpackConfig);

exports.comp = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
});
exports.hot = webpackHotMiddleware(compiler);