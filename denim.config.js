import TomlLoader from "src/plugins/toml"
import LiquidRenderer from "src/plugins/liquid"
// import Shortcodes from "src/plugins/shortcodes"
import MarkdownPlugin from "src/plugins/markdown";
import Aggregator from "src/plugins/aggregator";

export default {
  mode: "development",
  dataDir: "./examples/liquid_test/data",
  viewsDir: "./examples/liquid_test/views",
  outDir: "./examples/liquid_test/dist",
  plugins: [
    new TomlLoader(),
    new MarkdownPlugin(),
    new LiquidRenderer(),
    new Aggregator(),
    // new Shortcodes([
    //   {
    //     text: "AGENCY_NAME",
    //     callback: () => "GABBA GOO"
    //   }
    // ]),
  ],
};