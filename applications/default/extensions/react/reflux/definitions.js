var lodash = require('lodash');

var Stores = lodash.map(
  [
    "Application",
    "Routes",
    "Contexts",
    "Layout",
    "Page",
    "Panels",
    "Theme"
  ],
  key => [key, require(`./${ key }.js`)]
);

module.exports = lodash.zipObject(Stores);