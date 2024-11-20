import { globSync } from "glob";
import path from "path";
import { FrameworkAdapter } from "../base";

export class NextAppRouterAdapter implements FrameworkAdapter {
  name = "next-app";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findRoutes(rootDir: string) {
    return globSync(`src/**/page.{tsx,ts}`, { cwd: process.cwd() });
  }

  getOutputPath(route: string, outputDir: string) {
    return path.join(outputDir, route);
  }
}
