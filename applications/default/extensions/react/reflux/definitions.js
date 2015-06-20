var lodash = require('lodash');

module.exports = lodash(
  [
    "Application",
    "Routes",
    "Contexts",
    "Layout",
    "Page",
    "Panels",
    "Theme"
  ]
).map(
  key => [key, require(`./${ key }.js`)]
).zipObject().__wrapped__;