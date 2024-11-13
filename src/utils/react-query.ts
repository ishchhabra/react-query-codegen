import { NodePath } from "@babel/traverse";
import * as t from "./babel-types";

/**
 * Checks if the given path represents a call to the `useQuery` hook
 *
 * @param path The NodePath to check
 * @returns true if the path represents a call to the `useQuery` hook, false otherwise
 */
export function isReactQueryCall(path: NodePath) {
  if (!path.isCallExpression()) {
    return false;
  }

  const callee = path.get("callee");
  if (!callee.isIdentifier()) {
    return false;
  }

  const binding = callee.scope.getBinding(callee.node.name);
  if (!binding) {
    return false;
  }

  if (!t.isImportSpecifier(binding.path.node)) {
    return false;
  }

  const imported = binding.path.node.imported;
  if (!t.isIdentifier(imported)) {
    return false;
  }

  return imported.name === "useQuery";
}
