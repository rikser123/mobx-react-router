/**
 * @jest-environment jsdom
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { routes } from "./mockData";
import { routerStore } from "../routerStore";

const beforeEnterCallback = jest.fn();

routes[0].beforeEnter = beforeEnterCallback as any;

test("routeStore initial", () => {
  // @ts-ignore
  delete window.location;
  window.location = new URL(
    "https://localhost:8000/c/id?query=query&anotherQuery=anotherQuery",
  ) as any;

  routerStore.setInitialRoute(routes);

  const searchParams = routerStore.getSearchParams();
  const params = routerStore.getParams();

  expect(searchParams.query).toBe("query");
  expect(searchParams.anotherQuery).toBe("anotherQuery");
  expect(params.id).toBe("id");
  expect(routerStore.flatPaths).toHaveLength(8);
  expect(routerStore.parentRoutes).toHaveLength(1);
});

test("change route", () => {
  // @ts-ignore
  delete window.location;
  window.location = new URL("https://localhost:8000/c/a/bb") as any;

  routerStore.setCurrentRoute();

  const params = routerStore.getParams();
  const searchParams = routerStore.getSearchParams();
  expect(params.a).toBe("a");
  expect(routerStore.currentRoute.pathname).toBe("/c/a/bb");
  expect(routerStore.parentRoutes).toHaveLength(2);
  expect(searchParams).toEqual({});
});

test("change same route query", () => {
  // @ts-ignore
  delete window.location;
  window.location = new URL("https://localhost:8000/c/a/bb?query=query") as any;

  routerStore.setCurrentRoute();
  const searchParams = routerStore.getSearchParams();
  expect(searchParams).toEqual({ query: "query" });
});

test("select default path if current is undefined", () => {
  // @ts-ignore
  delete window.location;
  window.location = new URL("https://localhost:8000/c/a/bb/222/333") as any;

  routerStore.setCurrentRoute();
  expect(routerStore.currentRoute.pathname).toBe("/*");
});

test("select default path if there is one in children", () => {
  // @ts-ignore
  delete window.location;
  window.location = new URL("https://localhost:8000/c/b") as any;

  routerStore.setCurrentRoute();

  // @ts-ignore
  delete window.location;
  window.location = new URL(
    "https://localhost:8000/c/b/ddd/fff/fff/fff",
  ) as any;
  routerStore.setCurrentRoute();

  expect(routerStore.getMeta().childDefaultRoute).toBeTruthy();
});

test("beforeEnter is invoked", () => {
  // @ts-ignore
  delete window.location;
  window.location = new URL("https://localhost:8000/b") as any;

  routerStore.setCurrentRoute();

  // @ts-ignore
  delete window.location;
  window.location = new URL("https://localhost:8000/a") as any;

  routerStore.setCurrentRoute();
  expect(beforeEnterCallback).toHaveBeenCalled();
});
