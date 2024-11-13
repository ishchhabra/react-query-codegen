import { Binding, NodePath } from "@babel/traverse";
import * as t from "../../utils/babel-types";

export function analyzeNodeBinding(
  path: NodePath<t.Identifier>,
  binding: Binding,
  program: t.Program
) {
  if (binding.path.isFunctionDeclaration()) {
    program.body.push(binding.path.node);
    return null;
  }

  if (binding.path.isVariableDeclarator()) {
    const hash = t.hash(binding.path.node);
    binding.path.scope.rename(path.node.name, hash);
    program.body.push(t.variableDeclaration("const", [binding.path.node]));
    return null;
  }

  return null;
}
