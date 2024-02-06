import { ConfigRoute, FlatPaths } from "./types";

export const isEqual = <T, K>(elem1: T, elem2: K): boolean => {
  if (typeof elem1 !== typeof elem2) {
    return false;
  }

  if (!(elem1 instanceof Object) && !(elem2 instanceof Object)) {
    return (elem1 as unknown) === elem2;
  }

  if (!Array.isArray(elem1) && !Array.isArray(elem2)) {
    const elem1Object = elem1 as Record<string, unknown>;
    const elem2Object = elem2 as Record<string, unknown>;

    const elem1Keys = Object.keys(elem1Object).sort();
    const elem2Keys = Object.keys(elem2Object).sort();

    if (elem1Keys.join(",") !== elem2Keys.join(",")) {
      return false;
    }

    const comparisonByKeys = elem1Keys.map((key) =>
      isEqual(elem1Object[key], elem2Object[key]),
    );
    return comparisonByKeys.every(Boolean);
  }

  const elem1Array = elem1 as unknown[];
  const elem2Array = elem2 as unknown[];

  if (elem1Array.length !== elem1Array.length) {
    return false;
  }

  const elem1ArraySorted = elem1Array.toSorted();
  const elem2ArraySorted = elem2Array.toSorted();

  const arrayComparison = elem1ArraySorted.map((elem, index) =>
    isEqual(elem, elem2ArraySorted[index]),
  );
  return arrayComparison.every(Boolean);
};

export const comparePaths = (path: string, routePathTemplate: string) => {
  const pathSegments = path.split("/").filter(Boolean);

  const templateSegments = routePathTemplate.split("/").filter(Boolean);
  const optionalSegments = templateSegments.filter(
    (segment) => segment.startsWith(":") && segment.endsWith("?"),
  );
  const requiredSegments = templateSegments.filter(
    (segment) => !optionalSegments.includes(segment),
  );

  return (
    pathSegments.length >= requiredSegments.length &&
    pathSegments.every((segment, index) => {
      const currentTemplateSegment =
        requiredSegments[index] ||
        optionalSegments[index - requiredSegments.length];
      const isDynamicTemplate = (currentTemplateSegment ?? "").startsWith(":");

      return (
        currentTemplateSegment &&
        (isDynamicTemplate || segment === currentTemplateSegment)
      );
    })
  );
};

export const findCurrentRoute = (path: string, routes: ConfigRoute[]) => {
  const [pathWithoutSearch] = path.split("&");

  const iter = (path: string, routes: ConfigRoute[]): ConfigRoute | null => {
    const [firstRoute, ...rest] = routes;

    if (!firstRoute) {
      return null;
    }

    const isCurrentRoute = comparePaths(path, firstRoute.path);

    if (isCurrentRoute) {
      return firstRoute;
    }

    if (firstRoute.children) {
      const currentRoute = iter(path, firstRoute.children);

      if (currentRoute) {
        return currentRoute;
      }
    }

    return iter(path, rest);
  };

  return iter(pathWithoutSearch, routes);
};

export const createFlatPaths = (paths: ConfigRoute[]) => {
  const iter = (
    paths: ConfigRoute[],
    acc: FlatPaths,
    parentSegment: ConfigRoute[],
  ): FlatPaths => {
    const [first, ...rest] = paths;
    if (!first) {
      return acc;
    }
    acc.push([...parentSegment, first]);

    if (first.children) {
      iter(first.children, acc, acc[acc.length - 1]);
    }

    return iter(rest, acc, parentSegment);
  };

  return iter(paths, [], []);
};
