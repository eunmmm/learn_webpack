const fs = require("fs");
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = async (env, options) => {
  const config = {
    mode: 'none',
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, './dist')
    },
    plugins: [
      new MiniCssExtractPlugin(),
      ...(await fs.promises.readdir(path.resolve(__dirname, "./src/html")))
      .map((value) => {
        return path.resolve(__dirname, `./src/html/${value}`);
      })
      .filter((value) => {
        return fs.statSync(value).isFile();
      })
      .map((value) => {
        const basename = path.basename(value);
        const extname = path.extname(value);
        return new HtmlPlugin({
          filename: `./html/${basename.replace(extname, ".html")}`,
          template: `./src/html/${basename}`,
          minify: {
            collapseWhitespace: false,
            keepClosingSlash: true,
            removeComments: false,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
          },
        })
      })
    ],
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            "css-loader",
            "postcss-loader",
            "sass-loader"
          ]
        }
      ]
    },
  }
  return config;
}