import { Builder } from "./Builder";
import denimConfig from "denim.config.js";

export async function build( ) {
  const config = denimConfig;
  const builder = new Builder(config);
  await builder.build();
  console.log("Done");
}

build();