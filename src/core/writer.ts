import fs from "fs";
import path from "path";
import { FrameworkAdapter } from "../adapters/base";
import { DEFAULT_ENCODING } from "./constants";

export default function writeOutput(
  route: string,
  outputDir: string,
  adapter: FrameworkAdapter,
  output: string,
) {
  // Get the directory path without the file name
  const outputRoutePath = path.join("generated", route);

  if (!fs.existsSync(path.dirname(outputRoutePath))) {
    fs.mkdirSync(path.dirname(outputRoutePath), { recursive: true });
  }

  fs.writeFileSync(outputRoutePath, output, {
    encoding: DEFAULT_ENCODING,
  });
}
