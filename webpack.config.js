const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devtool: "inline-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Battleship",
      inject: "false",
      template: "./dist/index.html",
    }),
  ],
  devServer: {
    static: "./dist",
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
