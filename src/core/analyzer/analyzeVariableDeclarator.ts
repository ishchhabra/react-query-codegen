import { NodePath } from "@babel/traverse";
import * as t from "../../utils/babel-types";
import { isReactUseStateCall } from "../../utils/react-hook";

export function analyzeVariableDeclarator(
  path: NodePath<t.VariableDeclarator>,
): { statements: t.Statement[]; identifier?: t.Identifier } | undefined | null {
  const identifier = path.scope.generateUidIdentifier();
  const variableDeclarator = t.variableDeclarator(identifier, path.node.init);
  const variableDeclaration = t.variableDeclaration("const", [
    variableDeclarator,
  ]);

  const init = path.get("init");
  if (isReactUseStateCall(init)) {
    return analyzeReactUseStateVariableDeclarator(path);
  }

  return { statements: [variableDeclaration], identifier };
}

export function analyzeReactUseStateVariableDeclarator(
  path: NodePath<t.VariableDeclarator>,
): { statements: t.Statement[]; identifier?: t.Identifier } | undefined | null {
  const init = path.get("init");
  t.assertCallExpression(init.node);

  const initialValue = init.node.arguments[0] as t.Expression;
  const identifier = path.scope.generateUidIdentifier("useState");
  const variableDeclarator = t.variableDeclarator(identifier, initialValue);
  const variableDeclaration = t.variableDeclaration("const", [
    variableDeclarator,
  ]);

  return { statements: [variableDeclaration], identifier };
}
