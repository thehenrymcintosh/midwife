import TomlLoader from "src/plugins/toml"
import LiquidRenderer from "src/plugins/liquid"

export default {
  mode: "development",
  dataDir: "./examples/liquid_test/data",
  viewsDir: "./examples/liquid_test/views",
  outDir: "./examples/liquid_test/dist",
  plugins: [
    new TomlLoader(),
    new LiquidRenderer(),
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