import { NextAppRouterAdapter } from "./next/app-router";

/**
 * Base interface for framework adapters
 */
export interface FrameworkAdapter {
  name: string;

  findRoutes(rootDir: string): string[];

  getOutputPath(route: string, outputDir: string): string;
}

export function getFrameworkAdapter(name: string): FrameworkAdapter {
  switch (name) {
    case "next-app":
      return new NextAppRouterAdapter();
    default:
      throw new Error(`Unknown framework: ${name}`);
  }
}
