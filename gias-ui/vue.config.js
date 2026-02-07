const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    hot: true,
    open: true // Automatically open the browser when the server starts
  },
  chainWebpack: config => {
    // Add rule for handling PDF files
    config.module
      .rule('pdf')
      .test(/\.(pdf)(\?.*)?$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: '[name].[hash:8].[ext]'
      });
  }
});
