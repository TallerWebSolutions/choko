// webpack configuration for the angular-seed project using the
//angular-webpack-plugin.
var path = require('path');
var AngularPlugin = require('angular-webpack-plugin');
var webpack = require('webpack');
var appRoot = path.resolve('./applications/default/public/');

module.exports = {
  // The entrypoint module is 'myApp' in angular module names, but is in the
  // app/js/app.js file - so we have an alias below.
  entry: 'choko',
  output: {
    path: './applications/default/public/build',
    filename: 'bundle.js'
  },
  resolve: {
    root: [
      // We want roots to resolve the app code:
      path.resolve(appRoot, 'js'),
      // and the bower components:
      path.resolve(appRoot, 'lib'),
      path.resolve('./applications/*/extensions/*/pubic/js')

    ],
    alias: {
      // This one first to match just the entrypoint module.
      // We only need this because the module name doesn't match the file name.
      choko$: path.resolve(appRoot, 'js', 'app.js'),
      // This one maps all our modules called 'choko.something' to the app/js
      // directory
      choko: path.resolve(appRoot, 'js', 'app.js'),
      // This is also needed because the module name doesn't match the file name
      // but we don't need to locate the file because it is a bower component
      // with a file name the same as the directory (component) name:
      //  bower_components/angular-route/angular-route
      ngRoute$: 'angular-route',
      lodash: 'lodash/dist/lodash',
      jquery: 'jquery/dist/jquery',
      summernote: 'summernote/dist/summernote',
      ngResource: 'angular-resource/angular-resource',
      ngSanitize: 'angular-sanitize/angular-sanitize',
      angularFileUpload: 'ng-file-upload/angular-file-upload',
      CodeMirror: 'codemirror/lib/codemirror'
    },
  	extensions: ['', '.js', '.coffee', '.scss', '.css']
  },
  modulesDirectories: [
    path.resolve(appRoot, 'lib'),
    path.resolve(appRoot, 'js')
  ],
  plugins: [
    // The angular-webpack-plugin will:
    // - make the angular variable available by importing the 'angular' module
    //   whenever it is seen in the code.
    // - treat angular.module() dependencies as requires
    // - try to resolve modules using angular conventions.
    new AngularPlugin(),
    new webpack.ResolverPlugin([
    	new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
  	], ["normal", "loader"])
  ]
};