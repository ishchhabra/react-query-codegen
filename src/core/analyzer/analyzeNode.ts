import { NodePath } from "@babel/traverse";
import * as t from "../../utils/babel-types";
import { analyzeCallExpression } from "./analyzeCallExpression";
import { analyzeFunctionDeclaration } from "./analyzeFunctionDeclaration";
import { analyzeImportDeclaration } from "./analyzeImportDeclaration";
import { analyzeImportSpecifier } from "./analyzeImportSpecifier";
import { analyzeMemberExpression } from "./analyzeMemberExpression";
import { analyzeVariableDeclarator } from "./analyzeVariableDeclarator";

export default function analyzeNode(
  path: NodePath
): { statements: t.Statement[]; identifier?: t.Identifier } | undefined | null {
  switch (true) {
    case path.isCallExpression():
      return analyzeCallExpression(path);
    case path.isFunctionDeclaration():
      return analyzeFunctionDeclaration(path);
    case path.isImportDeclaration():
      return analyzeImportDeclaration(path);
    case path.isImportSpecifier():
      return analyzeImportSpecifier(path);
    case path.isMemberExpression():
      return analyzeMemberExpression(path);
    case path.isVariableDeclarator():
      return analyzeVariableDeclarator(path);
  }

  return undefined;
}
