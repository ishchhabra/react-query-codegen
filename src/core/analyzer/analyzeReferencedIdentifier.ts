import { NodePath } from "@babel/traverse";
import * as t from "../../utils/babel-types";
import analyzeNode from "./analyzeNode";

export function analyzeReferencedIdentifier(
  path: NodePath<t.Identifier | t.JSXIdentifier>
): { statements: t.Statement[]; identifier?: t.Identifier } | undefined | null {
  const binding = path.scope.getBinding(path.node.name);
  if (binding === undefined) {
    return undefined;
  }

  const analysisResult = analyzeNode(binding.path);
  if (analysisResult === undefined || analysisResult === null) {
    return analysisResult;
  }

  if (analysisResult.identifier) {
    binding.scope.rename(path.node.name, analysisResult.identifier.name);
  }

  return { statements: analysisResult.statements };
}
