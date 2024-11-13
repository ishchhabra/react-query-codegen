import { NodePath } from "@babel/traverse";
import * as t from "../../utils/babel-types";

export function analyzeFunctionDeclaration(
  path: NodePath<t.FunctionDeclaration>
): { statements: t.Statement[] } | undefined | null {
  return { statements: [path.node] };
}
