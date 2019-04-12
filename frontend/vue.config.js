const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        // target: 'https://www.easy-mock.com/mock/58ff50c7739ac16852059d35/',
        target: 'http://10.200.20.39:9999',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api' //重写接口
        }
      }
    }
  },
  //   pages: pagesObject,
  configureWebpack: config => {
    // 为生产环境修改配置...
    if (isProd) {
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_console: false
            }
          },
          sourceMap: true,
          parallel: true
        })
      );
      config.plugins.push(
        new CompressionWebpackPlugin({
          test: /\.js$|\.css$/,
          threshold: 10240,
          deleteOriginalAssets: false
        })
      );
    } else {
      // 为开发环境修改配置...
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');
    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear();
    // 添加要替换的 loader
    svgRule.include
      .add(path.join(__dirname, 'src/assets/icons'))
      .end()
      // 读取 SVG 源代码
      .use('raw-loader')
      .loader('raw-loader')
      .end()
      // 精简优化 SVG 源代码
      .use('svgo-loader')
      .loader('svgo-loader')
      .options({
        plugins: [{ removeTitle: true }, { removeViewBox: false }, { removeDimensions: true }]
      });
  }
}
