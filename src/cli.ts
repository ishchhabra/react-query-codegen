#!/usr/bin/env ts-node

import { Command } from "commander";
import { getFrameworkAdapter } from "./adapters/base";
import { analyzeRoute } from "./core/analyzer/analyzer";

const program = new Command();

program
  .name("react-query-hoist")
  .description(
    "Generates code for all the React Query calls " +
      "that can be hoisted and run at the top of the page",
  )
  .version("0.0.1")
  .option("-r, --root <path>", "The root directory of the project")
  .option("-o, --output <path>", "The output directory of the generated code")
  .option("-f, --framework <name>", "Framework (next-app)", "next-app")
  .action(async (options) => {
    try {
      const adapter = getFrameworkAdapter(options.framework);
      const routes = adapter.findRoutes(options.root);
      console.info(`🔍 Found ${routes.length} routes to analyze`);

      for (const route of routes) {
        analyzeRoute(route, adapter);
      }
    } catch (error) {
      console.trace(error);
      process.exit(1);
    }
  });

program.parse();
