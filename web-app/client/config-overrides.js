const webpack = require('webpack');

module.exports = function override(config) {
  // Add polyfills for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer'),
    process: require.resolve('process/browser'),
  };
  
  // Fix for process/browser in axios
  config.resolve.alias = {
    ...config.resolve.alias,
    'process/browser': require.resolve('process/browser')
  };
  
  // Add plugins to provide process and Buffer
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    // Add process as a global
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  );

  // Add node modules resolve path
  config.resolve.modules = [
    ...config.resolve.modules,
    'node_modules'
  ];

  return config;
};