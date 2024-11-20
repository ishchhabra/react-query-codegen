import { NodePath } from "@babel/traverse";
import * as t from "../../utils/babel-types";
import { isReactQueryCall } from "../../utils/react-query";
import { analyzeReferencedIdentifier } from "./analyzeReferencedIdentifier";

export function analyzeCallExpression(
  path: NodePath<t.CallExpression>,
): { statements: t.Statement[]; identifier?: t.Identifier } | undefined | null {
  if (isReactQueryCall(path)) {
    return analyzeReactQueryCall(path);
  }

  return undefined;
}

function analyzeReactQueryCall(
  path: NodePath<t.CallExpression>,
): { statements: t.Statement[]; identifier?: t.Identifier } | undefined | null {
  const statements = [];

  const analysisResult = analyzeReferences(path);
  if (analysisResult === undefined) {
    return undefined;
  }

  if (analysisResult !== null) {
    statements.push(...analysisResult.statements);
  }

  const callExpression = t.callExpression(
    t.memberExpression(t.identifier("queryClient"), t.identifier("fetchQuery")),
    path.node.arguments,
  );

  const parentPath = path.parentPath;
  if (parentPath.isVariableDeclarator()) {
    const identifier = path.scope.generateUidIdentifierBasedOnNode(path.node);
    path.scope.rename((parentPath.node.id as any).name, identifier.name);
    const variableDeclarator = t.variableDeclarator(identifier, callExpression);
    const variableDeclaration = t.variableDeclaration("const", [
      variableDeclarator,
    ]);
    statements.push(variableDeclaration);

    return { statements, identifier };
  } else {
    statements.push(t.expressionStatement(callExpression));
    return { statements };
  }
}

function analyzeReferences(
  path: NodePath,
): { statements: t.Statement[]; identifier?: t.Identifier } | undefined | null {
  const statements = [];

  let errorFound = false;
  path.traverse({
    ReferencedIdentifier(path) {
      const analysisResult = analyzeReferencedIdentifier(path);
      if (analysisResult === undefined) {
        errorFound = true;
      } else if (analysisResult !== null) {
        statements.push(...analysisResult.statements);
      }
    },
  });

  return errorFound ? undefined : { statements };
}
