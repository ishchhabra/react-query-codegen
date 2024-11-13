function analyzeAssignmentPattern(
  name: string,
  path: NodePath<t.AssignmentPattern>
): AnalyisResult | undefined {
  return undefined;
}

function analyzeCallExpression(
  name: string,
  path: NodePath<t.CallExpression>
): AnalyisResult | undefined {
  const statements: t.Statement[] = [];

  const functionArguments = path.get("arguments");
  for (const argument of functionArguments) {
    const argumentAnalysisResult = analyzeNode(undefined, argument);
    if (argumentAnalysisResult === undefined) {
      return undefined;
    }

    if (argumentAnalysisResult.action === "replace") {
      argument.replaceWith(argumentAnalysisResult.node);
    }

    statements.push(...argumentAnalysisResult.statements);
  }

  if (isReactQueryCall(path)) {
    const hash = t.hash(path.node);
    const prefetchFunction = t.variableDeclaration("const", [
      t.variableDeclarator(
        t.identifier(hash),
        t.callExpression(
          t.memberExpression(
            t.identifier("queryClient"),
            t.identifier("fetchQuery")
          ),
          path.node.arguments
        )
      ),
    ]);

    return {
      statements: [...statements, prefetchFunction],
      action: "replace",
      node: t.identifier(hash),
    };
  }

  const callee = path.get("callee");
  if (!callee.isIdentifier()) {
    return undefined;
  }

  const binding = path.scope.getBinding(callee.node.name);
  const bindingAnalysisResult = analyzeNode(callee.node.name, binding.path);
  if (bindingAnalysisResult === undefined) {
    return undefined;
  }

  statements.push(...bindingAnalysisResult.statements);

  const callArguments = path.get("arguments");
  for (const argument of callArguments) {
    const argumentAnalysisResult = analyzeNode(undefined, argument);
    if (argumentAnalysisResult === undefined) {
      return undefined;
    }

    statements.push(...argumentAnalysisResult.statements);
  }

  return undefined;
}

function analyzeFunctionDeclaration(
  name: string,
  path: NodePath<t.FunctionDeclaration>
): AnalyisResult | undefined {
  const hash = t.hash(path.node);
  path.node.id.name = hash;

  return {
    statements: [path.node],
    action: "replace",
    node: t.identifier(hash),
  };
}

function analyzeIdentifier(
  name: string,
  path: NodePath<t.Identifier>
): AnalyisResult | undefined {
  const binding = path.scope.getBinding(path.node.name);
  if (binding.path === path) {
    return {
      statements: [],
      action: "keep",
    };
  }

  const analyzedBinding = analyzeNode(name, binding.path);
  if (analyzedBinding === undefined) {
    return undefined;
  }

  return {
    statements: analyzedBinding.statements,
    action: "replace",
    node: binding.path.node,
  };
}

function analyzeImportSpecifier(
  name: string,
  path: NodePath<t.ImportSpecifier>
): AnalyisResult | undefined {
  return undefined;
}

function analyzeObjectExpression(
  path: NodePath<t.ObjectExpression>
): AnalyisResult | undefined {
  const statements: t.Statement[] = [];

  const properties = path.get("properties");
  for (const property of properties) {
    const propertyAnalysisResult = analyzeNode(undefined, property);
    if (propertyAnalysisResult === undefined) {
      return undefined;
    }

    if (propertyAnalysisResult.action === "replace") {
      property.replaceWith(propertyAnalysisResult.node);
    }

    statements.push(...propertyAnalysisResult.statements);
  }

  return {
    statements,
    action: "keep",
  };
}

function analyzeObjectProperty(
  path: NodePath<t.ObjectProperty>
): AnalyisResult | undefined {
  return {
    statements: [],
    action: "skip",
  };
}
