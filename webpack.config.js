const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    resolve: { modules: ['node_modules'] ,
                },
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin({ patterns:
        [{ from: "./src/index.html", to: "index.html" }]}),
  ],

  devServer: { static: './'},


};