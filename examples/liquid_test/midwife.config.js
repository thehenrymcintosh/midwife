const Plugins = require("midwife-core-plugins");

module.exports = {
  dataDir: "./data",
  viewsDir: "./views",
  outDir: "./dist",
  refPrefix: "#",
  plugins: Plugins.all,
};