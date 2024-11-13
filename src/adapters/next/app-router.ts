import { globSync } from "glob";
import path from "path";
import { FrameworkAdapter } from "../base";

export class NextAppRouterAdapter implements FrameworkAdapter {
  name = "next-app";

  findRoutes(rootDir: string) {
    return globSync(`src/**/page.{tsx,ts}`, { cwd: process.cwd() });
  }

  getOutputPath(route: string, outputDir: string) {
    return path.join(outputDir, route);
  }
}
