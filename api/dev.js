import webpack from "webpack";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackDevMiddleware from "webpack-dev-middleware";
import config from "../config/webpack.config.cjs";
const webpackConfig = config({development:true});

const compiler = webpack(webpackConfig);

export const comp = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
});
export const hot = webpackHotMiddleware(compiler);