import path from "path";

import fs from "fs";
import { NextAppRouterAdapter } from "../adapters/next/app-router";
import { analyzeRoute } from "./analyzer/analyzer";

describe("analyzeRoute", () => {
  let adapter: NextAppRouterAdapter;

  beforeEach(() => {
    adapter = new NextAppRouterAdapter();
    jest.clearAllMocks();
  });

  it("should analyze a basic query call properly", () => {
    const writeFileSyncMock = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation();

    analyzeRoute(
      path.join(__dirname, "__fixtures__/next-app/app/basic-call/page.tsx"),
      adapter
    );

    const [_, outputContent] = writeFileSyncMock.mock.calls[0];
    expect(outputContent).toMatchSnapshot();
  });

  it("should analyze a basic query call with variable properly", () => {
    const writeFileSyncMock = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation();

    analyzeRoute(
      path.join(
        __dirname,
        "__fixtures__/next-app/app/basic-call-with-variable/page.tsx"
      ),
      adapter
    );

    const [_, outputContent] = writeFileSyncMock.mock.calls[0];
    expect(outputContent).toMatchSnapshot();
  });

  it("should analyze a query dependent on another query properly", () => {
    const writeFileSyncMock = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation();

    analyzeRoute(
      path.join(
        __dirname,
        "__fixtures__/next-app/app/query-dependent-on-query/page.tsx"
      ),
      adapter
    );

    const [_, outputContent] = writeFileSyncMock.mock.calls[0];
    expect(outputContent).toMatchSnapshot();
  });

  it("should analyze a query dependent on useState properly", () => {
    const writeFileSyncMock = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation();

    analyzeRoute(
      path.join(
        __dirname,
        "__fixtures__/next-app/app/query-dependent-on-use-state/page.tsx"
      ),
      adapter
    );

    const [_, outputContent] = writeFileSyncMock.mock.calls[0];
    expect(outputContent).toMatchSnapshot();
  });
});
