// Custom webpack configuration to handle Genkit dependencies
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      // Ensure handlebars resolves correctly
      'handlebars': path.resolve(__dirname, 'node_modules/handlebars/dist/handlebars.min.js'),
    },
  },
  module: {
    rules: [
      {
        test: /node_modules\/handlebars\/lib\/index\.js$/,
        use: 'null-loader',
      },
    ],
  },
  ignoreWarnings: [
    {
      module: /handlebars/,
      message: /require\.extensions/,
    },
    {
      module: /dotprompt/,
      message: /require\.extensions/,
    },
  ],
};