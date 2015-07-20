var Webpack = require("webpack");
var lodash = require('lodash');
var path = require('path');
 
function getSettings (options) {
  var settings = {
    "entry":      {},
 
    "node": {
      "fs": "empty",
      "net": "empty",
      "tls": "empty",
      "fs": "empty",
      "console": true,
    },
 
    "resolve":    {
      "extensions": [
        "",
        ".js",
        ".jsx",
        ".scss",
        ".sass",
        ".css"
      ]
    },
 
    "module": {
      "loaders": [
        {
          "test":   /\.js(x)?$/,
          "loader": "jsx-loader?harmony"
        },
        {
          "test":   /\.css$/,
          "loader": "style-loader!css-loader!autoprefixer-loader"
        },
        {
          "test":   /\.scss$/,
          "loader": "style-loader!css-loader!autoprefixer-loader!sass-loader"
        },
        {
          "test":   /\.sass$/,
          "loader": "style-loader!css-loader!autoprefixer-loader!sass-loader"
        }
      ]
    },
 
    "output": {
      "filename":       "[name].js",
      "chunkFilename":  "chunk_[id].js",
      "publicPath":     "/bundles/",
      "pathinfo":       true
    },
 
 
    "plugins": [
      new Webpack.optimize.DedupePlugin(),
      new Webpack.optimize.OccurenceOrderPlugin(),
    ]
  };
 
  // `settings.context` tells Webpack where to look up its relative paths.
  // This includes things you wouldn't expect, like the NPM modules for each
  // loader.
  //
  // Since `options.paths` already gives us absolute paths to our external
  // dependencies, we set `context` to our own `__dirname`.  This makes sure
  // the dependencies are always loaded, even if our caller doesn't have them
  // installed.
  settings.context = path.resolve(__dirname, '../');
  settings.resolveLoader = settings.resolveLoader || {};
  settings.resolveLoader.root = path.join(options.baseDir, 'node_modules');
  // @TODO: Options vars should be a merge of the settings.
  settings.output.path = options.output.path;
  settings.entry = options.entry;
 
 
  if (options.hasOwnProperty("devServerOrigin")) {
 
    // Add the HMR client to each exported bundle
    for (var bundleName in settings.entry) {
      settings.entry[bundleName].push(
        "webpack-dev-server/client?" + options.devServerOrigin, // e.g. localhost:8081
        "webpack/hot/dev-server"
      );
    }
 
    settings.output.publicPath = options.devServerOrigin + settings.output.publicPath;
 
 
    // react-hot-loader will keep the components updated when HMR happens
    jsxLoaderSettings = settings.module.loaders.filter(
      function (loader, i, loaders) {
        return loader.test.exec(".jsx");
      }
    )[0];
 
    jsxLoaderSettings.loader = "react-hot-loader!" + jsxLoaderSettings.loader;
 
    settings.plugins.push(
      new Webpack.HotModuleReplacementPlugin()
    );
  }
 
  if (options.hasOwnProperty("constants")) {
    settings.plugins.push(
      new Webpack.DefinePlugin(options.constants)
    );
  }
 
  if (options.hasOwnProperty("ignoredModuleNames") && options.ignoredModuleNames.length) {
    settings.plugins.push(
      new Webpack.IgnorePlugin(
        RegExp(options.ignoredModuleNames.join("|"))
      )
    );
  }
 
  if (options.hasOwnProperty("minimizeFileSize") && options.minimizeFileSize) {
    settings.plugins.push(
      new Webpack.optimize.UglifyJsPlugin(
        {
          "output":   {
                        "inline_script":   true
                      }
        }
      )
    );
  }
 
  return settings;
}
 
module.exports = getSettings;