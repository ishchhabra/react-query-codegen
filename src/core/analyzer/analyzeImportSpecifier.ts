import { NodePath } from "@babel/traverse";
import * as t from "../../utils/babel-types";

export function analyzeImportSpecifier(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  path: NodePath<t.ImportSpecifier>,
): { statements: t.Statement[]; identifier?: t.Identifier } | undefined | null {
  return null;
}
