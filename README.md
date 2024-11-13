# React Query Codegen

A static analysis tool that automatically generates prefetch code for React Query calls, allowing you to maintain code colocation without sacrificing performance.

## The Problem

In React applications using React Query, we face a common dilemma:

1. **Colocation is Good**: Keeping query calls next to the components that use them makes code more maintainable and easier to understand.

2. **But... Fetch-on-Render is Bad**: Colocated queries only start fetching after the component renders, creating a waterfall effect.

3. **Loader Pattern Breaks Colocation**: Moving queries to loaders improves performance but spreads related code across different files.

## The Solution

React Query Codegen analyzes your code and automatically generates optimized prefetch calls while letting you keep your queries colocated. It:

1. Finds all React Query calls that can be safely hoisted
2. Generates prefetch code
