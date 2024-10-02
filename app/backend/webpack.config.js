const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  entry: './src/main.ts',  // Entry point to your application
  target: 'node',          // Specifies Node.js environment for Lambda
  mode: 'production',      // Production mode for optimization
  output: {
    filename: 'main.js',   // Single bundled file as output
    path: join(__dirname, '../../dist'),
    libraryTarget: 'commonjs2', // Required for AWS Lambda
  },
  resolve: {
    extensions: ['.ts', '.js'],  // Allow importing .ts and .js files
  },
  module: {
    rules: [
      {
        test: /\.ts$/,          // Handle TypeScript files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: [
    /node_modules/,           // Exclude node_modules from the bundle to reduce size
  ],
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',           // Use TypeScript compiler
      main: './src/main.ts',      // Main entry point for NestJS
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],   // If you have assets, include them
      optimization: false,        // Disable optimizations for simplicity
      outputHashing: 'none',      // Disable output hashing
    }),
  ],
};
