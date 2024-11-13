import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import crypto from "crypto";
export * from "@babel/types";

/**
 * Checks if the given node is an import specifier (ImportSpecifier, ImportDefaultSpecifier, or ImportNamespaceSpecifier)
 *
 * @param node The node to check
 * @returns true if the node is an import specifier, false otherwise
 */
export function isAnyImportSpecifier(node: t.Node) {
  return (
    t.isImportSpecifier(node) ||
    t.isImportDefaultSpecifier(node) ||
    t.isImportNamespaceSpecifier(node)
  );
}

/**
 * Checks if the given path represents a function parameter
 *
 * @param path The NodePath to check
 * @returns true if the path represents a function parameter, false otherwise
 */
export function isFunctionParameter(path: NodePath) {
  const parentPath = path.parentPath;
  if (!parentPath?.isFunction()) {
    return false;
  }

  return parentPath.node.params.some((param) => param === path.node);
}

export function getImportName(path: NodePath) {
  if (!isAnyImportSpecifier(path.node)) {
    return null;
  }

  return path.node.local.name;
}

export function hash(node: t.Node) {
  return `$${crypto
    .createHash("sha256")
    .update(JSON.stringify(node))
    .digest("hex")
    .substring(0, 8)}`;
}
