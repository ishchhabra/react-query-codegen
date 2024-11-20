import { NodePath } from "@babel/traverse";
import * as t from "../../utils/babel-types";

export function analyzeMemberExpression(
  path: NodePath<t.MemberExpression>,
): { statements: t.Statement[] } | undefined | null {
  return { statements: [] };
}
