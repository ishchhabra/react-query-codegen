import { ParserPlugin } from "@babel/parser";

export const DEFAULT_SOURCE_TYPE = "module" as const;
export const DEFAULT_ENCODING = "utf-8" as const;
export const DEFAULT_PLUGINS: ParserPlugin[] = ["jsx", "typescript"];
