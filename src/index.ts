import { Builder } from "./Builder";
import denimConfig from "denim.config.js";

export function build( ) {
  const config = denimConfig;
  const builder = new Builder(config);
  builder.build();
}

build();