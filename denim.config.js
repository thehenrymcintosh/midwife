import TomlLoader from "src/plugins/toml"

export default {
  mode: "development",
  dataDir: "./examples/liquid_test/data",
  plugins: [
    new TomlLoader(),
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