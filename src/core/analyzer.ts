import generate from "@babel/generator";
import { parse } from "@babel/parser";
import * as fs from "fs";
import { FrameworkAdapter } from "../adapters/base";
import * as t from "../utils/babel-types";
import { isReactQueryCall } from "../utils/react-query";
import { analyzeCallExpression } from "./analyzer/analyzeNode";
import { findQueryCalls } from "./analyzer/findQueryCalls";
import {
  DEFAULT_ENCODING,
  DEFAULT_PLUGINS,
  DEFAULT_SOURCE_TYPE,
} from "./constants";
import writeOutput from "./writer";

export function analyzeRoute(route: string, adapter: FrameworkAdapter) {
  const content = fs.readFileSync(route, { encoding: DEFAULT_ENCODING });
  const ast = parse(content, {
    sourceType: DEFAULT_SOURCE_TYPE,
    plugins: DEFAULT_PLUGINS,
  });
  const queryCalls = findQueryCalls(ast);
  console.info(`🔍 Found ${queryCalls.length} React Query calls in ${route}`);

  const program: t.Program = t.program([]);

  for (const queryCall of queryCalls) {
    queryCall.traverse({
      MemberExpression(path) {
        const object = path.get("object");
        if (!object.isIdentifier()) {
          return;
        }

        const binding = path.scope.getBinding(object.node.name);
        if (binding === undefined) {
          return;
        }

        if (!binding.path.isVariableDeclarator()) {
          return;
        }

        const init = binding.path.get("init");
        if (!isReactQueryCall(init)) {
          return;
        }

        const property = path.get("property");
        if (!property.isIdentifier()) {
          return;
        }

        if (property.node.name !== "data") {
          queryCalls.splice(queryCalls.indexOf(queryCall), 1);
          return;
        }

        path.replaceWith(object.node);
      },
    });
  }

  for (const queryCall of queryCalls) {
    const analysisResult = analyzeCallExpression(queryCall, program);
    if (analysisResult === undefined) {
      continue;
    }
  }

  const outputPath = adapter.getOutputPath(route, route);
  const output = generate(program);
  writeOutput(route, outputPath, adapter, output.code);
}
