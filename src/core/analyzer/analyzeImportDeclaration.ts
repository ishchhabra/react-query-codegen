import { NodePath } from "@babel/traverse";
import * as t from "../../utils/babel-types";

export function analyzeImportDeclaration(
  path: NodePath<t.ImportDeclaration>
): { statements: t.Statement[]; identifier?: t.Identifier } | undefined | null {
  return null;
}
