import {
  findCurrentRoute,
  isEqual,
  comparePaths,
  createFlatPaths,
} from "../utils";
import { routes } from "./mockData";

test("findCurrentRoute", () => {
  const aRoute = findCurrentRoute("/a", routes);
  expect(aRoute?.path).toBe("/a");

  const cRoute = findCurrentRoute("/c", routes);
  expect(cRoute?.path).toBe("/c");

  const cARoute = findCurrentRoute("/c/22", routes);
  expect(cARoute?.path).toBe("/c/:id");

  const cABbRoute = findCurrentRoute("/c/22/bb", routes);
  expect(cABbRoute?.path).toBe("/c/:a/bb");

  const missingRoute = findCurrentRoute("/missing", routes);
  expect(missingRoute).toBeNull();
});

test("comparePaths", () => {
  expect(comparePaths("/a", "/a")).toBeTruthy();
  expect(comparePaths("/a", "/b")).toBeFalsy();
  expect(comparePaths("/a/22", "/a/:id")).toBeTruthy();
  expect(comparePaths("/a/22", "/b/:id")).toBeFalsy();
  expect(comparePaths("/a/22", "/b/:id/:id2")).toBeFalsy();
  expect(comparePaths("/a/22/33", "/a/:id/:id2")).toBeTruthy();
  expect(comparePaths("/a/22", "/a/:id/:id2?")).toBeTruthy();
  expect(comparePaths("/a/22/33", "/a/:id/:id2?")).toBeTruthy();
  expect(comparePaths("/a/22/33/44", "/a/:id/:id2?")).toBeFalsy();
});

test("createFlatPaths", () => {
  const flatPaths = createFlatPaths(routes);
  expect(flatPaths).toHaveLength(8);
  expect(flatPaths.at(-3)).toHaveLength(3);
  expect(flatPaths.at(-3)?.at(-1)?.path).toBe("/c/:a/bb");
});

describe("isEqual", () => {
  test("is Equal simple", () => {
    expect(isEqual(true, true)).toBeTruthy();
    expect(isEqual(true, false)).toBeFalsy();

    expect(isEqual(1, 1)).toBeTruthy();
    expect(isEqual(1, "1")).toBeFalsy();
    expect(isEqual(1, 2)).toBeFalsy();

    expect(isEqual("a", "a")).toBeTruthy();
    expect(isEqual("ab", "ab")).toBeTruthy();
    expect(isEqual("b", "ab")).toBeFalsy();

    expect(isEqual(null, null)).toBeTruthy();
  });

  test("is Equal object", () => {
    expect(isEqual({ a: "a" }, { a: "a" })).toBeTruthy();
    expect(isEqual({ a: "a" }, { a: "b" })).toBeFalsy();

    expect(isEqual({ a: "a", b: "b" }, { a: "a" })).toBeFalsy();
    expect(isEqual({ a: "a", b: "b" }, { a: "a", b: "b" })).toBeTruthy();

    expect(isEqual({ a: "a", b: "b" }, { a: "a", b: "b1" })).toBeFalsy();
    expect(
      isEqual({ a: "a", b: "b", c: 1 }, { a: "a", b: "b", c: 1 }),
    ).toBeTruthy();
    expect(
      isEqual(
        {
          a: "a",
          b: "b",
          c: 1,
          d: null,
        },
        { a: "a", b: "b", c: 1 },
      ),
    ).toBeFalsy();
  });

  test("is Equal Array", () => {
    expect(isEqual([], [])).toBeTruthy();
    expect(isEqual([1], [1])).toBeTruthy();
    expect(isEqual([1], [2])).toBeFalsy();
    expect(isEqual([1, 1], [1])).toBeFalsy();
    expect(isEqual([1, 1], [1, 1])).toBeTruthy();

    expect(isEqual([{}], [{}])).toBeTruthy();
    expect(isEqual([{ a: "a" }], [{ a: "a" }])).toBeTruthy();
    expect(isEqual([{ a: "a" }], [{ a: "b" }])).toBeFalsy();
    expect(isEqual([{ a: "a", b: 1 }], [{ a: "b" }])).toBeFalsy();
    expect(isEqual([{ a: "a", b: 1 }], [{ a: "a", b: 1 }])).toBeTruthy();

    expect(
      isEqual([{ a: "a", b: 1, c: { a: 1 } }], [{ a: "a", b: 1, c: { a: 1 } }]),
    ).toBeTruthy();
    expect(
      isEqual([{ a: "a", b: 1, c: { a: 2 } }], [{ a: "a", b: 1, c: { a: 1 } }]),
    ).toBeFalsy();
  });
});
