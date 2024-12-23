import generate from "@babel/generator";
import { parse } from "@babel/parser";
import fs from "fs";
import { FrameworkAdapter } from "../../adapters/base";
import * as t from "../../utils/babel-types";
import { isReactQueryCall } from "../../utils/react-query";
import {
  DEFAULT_ENCODING,
  DEFAULT_PLUGINS,
  DEFAULT_SOURCE_TYPE,
} from "../constants";
import writeOutput from "../writer";
import analyzeNode from "./analyzeNode";
import { findQueryCalls } from "./findQueryCalls";

export function analyzeRoute(route: string, adapter: FrameworkAdapter) {
  const content = fs.readFileSync(route, DEFAULT_ENCODING);
  const ast = parse(content, {
    sourceType: DEFAULT_SOURCE_TYPE,
    plugins: DEFAULT_PLUGINS,
  });
  const queryCalls = findQueryCalls(ast);
  console.info(`🔍 Found ${queryCalls.length} React Query calls in ${route}`);

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

  const statements: t.Statement[] = [];
  for (const queryCall of queryCalls) {
    const analysisResult = analyzeNode(queryCall);
    if (analysisResult === undefined || analysisResult === null) {
      continue;
    }

    statements.push(...analysisResult.statements);
  }

  const queryClientIdentifier = t.identifier("queryClient");
  queryClientIdentifier.typeAnnotation = t.typeAnnotation(
    t.genericTypeAnnotation(t.identifier("QueryClient"), null),
  );
  const prefetchQueryFunctionDeclaration = t.functionDeclaration(
    t.identifier("prefetchQuery"),
    [queryClientIdentifier],
    t.blockStatement(statements),
  );
  const exportNamedDeclaration = t.exportNamedDeclaration(
    prefetchQueryFunctionDeclaration,
  );
  const importDeclaration = t.importDeclaration(
    [
      t.importSpecifier(
        t.identifier("QueryClient"),
        t.identifier("QueryClient"),
      ),
    ],
    t.stringLiteral("@tanstack/react-query"),
  );
  const program = t.program([importDeclaration, exportNamedDeclaration]);

  const outputPath = adapter.getOutputPath(route, route);
  const outputContent = generate(program).code;
  writeOutput(route, outputPath, adapter, outputContent);
}
