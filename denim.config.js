import TomlLoader from "src/plugins/toml"
import LiquidRenderer from "src/plugins/liquid"
import Shortcodes from "src/plugins/shortcodes"

export default {
  mode: "development",
  dataDir: "./examples/liquid_test/data",
  viewsDir: "./examples/liquid_test/views",
  outDir: "./examples/liquid_test/dist",
  plugins: [
    new TomlLoader(),
    new LiquidRenderer(),
    new Shortcodes("Henry's Agency"),
  ],
  globals: {
    nav: [
      {
        text: "home",
        href: "/",
      },
      {
        text: "landing",
        href: "/landing",
      },
    ],
  },
};