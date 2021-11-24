const path = require("path"); //Path esta disponible dentro de node
const HtmlWebpackPlugin = require("html-webpack-plugin"); //Html
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //Css
const CopyPlugin = require("copy-webpack-plugin"); //Copiar imagenes
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); //Optimizador
const TerserPlugin = require("terser-webpack-plugin"); //Optimizador
const Dotenv = require("dotenv-webpack"); //Variables de entorno
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

//modulo que exportamos, con las configuraciones
module.exports = {
  entry: "./src/index.js", //entry: Punto de entrada de la aplicación

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    assetModuleFilename: "assets/images/[hash][ext][query]", //Imagenes y fonts
  }, //outpu: Hacia donde enviamos lo que prepara WebPack, por default carpeta dist, archivo main.js

  resolve: {
    extensions: [".js"],
    alias: {
      "@utils": path.resolve(__dirname, "src/utils/"),
      "@templates": path.resolve(__dirname, "src/templates/"),
      "@styles": path.resolve(__dirname, "src/styles/"),
      "@images": path.resolve(__dirname, "src/assets/images/"),
    },
  }, //resolve: Con que extensiones va a trabajar en este proyecto

  module: {
    rules: [
      //Regla para babel
      {
        test: /\.m?js$/, //Expresión regular >Incluye cualquier archivo mjs o js
        exclude: /node_modules/, // Excluye node_modules
        use: {
          loader: "babel-loader", //Utiliza a babel-loader
        },
      },
      //Regla para css
      {
        test: /\.css|.styl$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"],
      },
      //Regla para importar los recursos imagenes
      {
        test: /\.png/,
        type: "asset/resource",
      },
      //Regla para fuentes
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000,
            mimetype: "application/font-woff",
            name: "[name].[contenthash].[ext]",
            outputPath: "./assets/fonts/",
            publicPath: "../assets/fonts/",
            esModule: false,
          },
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true, //Insercción de los elementos
      template: "./public/index.html", //template
      filename: "./index.html", //resultado
    }),
    new MiniCssExtractPlugin({
      filename: "assets/[name].[contenthash].css",
    }),

    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "assets/images"), //Desde donde //podemos mover un solo archivo o toda la carpeta
          to: "assets/images", //Hacia donde
        },
      ],
    }),
    new Dotenv(),
    new CleanWebpackPlugin(),
  ],

  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
};
