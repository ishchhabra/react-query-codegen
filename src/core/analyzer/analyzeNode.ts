import { NodePath } from "@babel/traverse";
import * as t from "../../utils/babel-types";
import { isReactQueryCall } from "../../utils/react-query";
import { analyzeNodeBinding } from "./analyzeNodeBinding";

interface AnalyisResult {
  statements: t.Statement[];
  action: "replace" | "keep" | "skip";
  node?: t.Node | undefined;
}

export function analyzeNode(path: NodePath, program: t.Program) {
  let errorFound = false;

  path.traverse({
    CallExpression(path) {
      if (analyzeCallExpression(path, program) === undefined) {
        errorFound = true;
      }
    },
    Identifier(path) {
      if (analyzeIdentifier(path, program) === undefined) {
        errorFound = true;
      }
    },
  });

  if (errorFound) {
    return undefined;
  }

  return null;
}

export function analyzeCallExpression(
  path: NodePath<t.CallExpression>,
  program: t.Program
): AnalyisResult | undefined {
  if (analyzeNode(path, program) === undefined) {
    return undefined;
  }

  if (isReactQueryCall(path)) {
    const hash = t.hash(path.node);
    program.body.push(
      t.variableDeclaration("const", [
        t.variableDeclarator(
          t.identifier(hash),
          t.callExpression(
            t.memberExpression(
              t.identifier("queryClient"),
              t.identifier("fetchQuery")
            ),
            path.node.arguments
          )
        ),
      ])
    );

    path.replaceWith(t.identifier(hash));
    return null;
  }

  throw Error(`Unhandled node type ${path.type}`);
}

function analyzeIdentifier(path: NodePath<t.Identifier>, program: t.Program) {
  const binding = path.scope.getBinding(path.node.name);
  if (binding === undefined || binding.path === path) {
    return null;
  }

  if (analyzeNodeBinding(path, binding, program) === undefined) {
    return undefined;
  }

  return null;
}
