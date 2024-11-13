import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as fs from "fs";
import * as t from "../../utils/babel-types";
import { isReactQueryCall } from "../../utils/react-query";
import {
  DEFAULT_ENCODING,
  DEFAULT_PLUGINS,
  DEFAULT_SOURCE_TYPE,
} from "../constants";

export function findQueryCalls(ast: t.Node): NodePath<t.CallExpression>[] {
  const paths: NodePath<t.CallExpression>[] = [];
  const visitedFiles = new Set<string>();

  traverse(ast, {
    CallExpression(path) {
      paths.push(...findQueryCallsRecursive(path, visitedFiles));
    },
  });

  return paths;
}

function findQueryCallsRecursive(
  path: NodePath,
  visitedFiles: Set<string>
): NodePath<t.CallExpression>[] {
  const paths: NodePath<t.CallExpression>[] = [];

  if (isReactQueryCall(path)) {
    path.assertCallExpression();
    paths.push(path);
    return paths;
  }

  const callee = path.get("callee") as NodePath;
  if (!callee.isIdentifier()) {
    return paths;
  }

  const binding = callee.scope.getBinding(callee.node.name);
  if (!binding) {
    return paths;
  }

  if (!t.isAnyImportSpecifier(binding.path.node)) {
    paths.push(...findQueryCalls(binding.path.node));
    return paths;
  }

  const importDeclaration = binding.path.parentPath;
  if (!importDeclaration || !t.isImportDeclaration(importDeclaration.node)) {
    return paths;
  }

  const importSource = importDeclaration.node.source.value;
  if (visitedFiles.has(importSource)) {
    return paths;
  }
  visitedFiles.add(importSource);

  try {
    const importContent = fs.readFileSync(importSource, {
      encoding: DEFAULT_ENCODING,
    });
    const importAst = parse(importContent, {
      sourceType: DEFAULT_SOURCE_TYPE,
      plugins: DEFAULT_PLUGINS,
    });

    traverse(importAst, {
      ExportDefaultDeclaration(exportPath) {
        if (!t.isImportDefaultSpecifier(binding.path.node)) {
          return;
        }

        const declaration = exportPath.get("declaration");
        if (!declaration.isFunctionDeclaration()) {
          return;
        }

        paths.push(...findQueryCallsRecursive(declaration, visitedFiles));
      },
      ExportNamedDeclaration(exportPath) {
        if (!t.isImportSpecifier(binding.path.node)) {
          return;
        }

        const declaration = exportPath.get("declaration");
        if (!declaration.isFunctionDeclaration()) {
          return;
        }

        const name = declaration.node.id?.name;
        if (!name) {
          return;
        }

        if (
          t.isIdentifier(binding.path.node.imported) &&
          name !== binding.path.node.imported.name
        ) {
          return;
        }

        paths.push(...findQueryCallsRecursive(declaration, visitedFiles));
      },
    });
  } catch (error) {
    console.warn(`Failed to analyze imported file: ${importSource}`, error);
    return paths;
  }
}
