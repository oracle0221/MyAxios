const path=require('path');
const Strip=require('strip-loader');

module.exports=function (env={}){
  const dev=env.dev;

  return {
    mode: dev?'development':'production',
    entry: dev?['@babel/polyfill', './src/index.js']:'./src/axios.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: dev?'axios.js':'axios.min.js',
      sourceMapFilename: dev?'axios.map':'axios.min.map',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {test: /\.js$/i, use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          ...dev?[]:[{
            loader: Strip.loader('alert', 'assert')
          }],
        ]}
      ]
    },
    devtool: 'source-map',
    devServer: {
      port: 8000,
      open: true,
    }
  };
};
