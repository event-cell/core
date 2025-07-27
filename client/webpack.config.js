const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'live-timing': './src/live-timing/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist/live-timing'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}; 