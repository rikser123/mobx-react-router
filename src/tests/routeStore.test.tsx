import { RouteStore } from "../routeStore";
import { routes } from "./mockData";

test("routerStore 1", () => {
  const route = new RouteStore(
    "https://localhost:8000/c/id?query=query&anotherQuery=anotherQuery",
    routes[2].children?.[0],
  );

  expect(route.pathname).toBe("/c/id");
  expect(route.search).toBe("?query=query&anotherQuery=anotherQuery");
  expect(route.host).toBe("localhost:8000");
  expect(route.params.id).toBe("id");
  expect(route.searchParams.query).toBe("query");
  expect(route.searchParams.anotherQuery).toBe("anotherQuery");
});

test("routerStore 2", () => {
  const route = new RouteStore(
    "https://localhost:8000/c/id/bb#hash",
    routes[2].children?.[1].children?.[0],
  );

  expect(route.pathname).toBe("/c/id/bb");
  expect(route.hash).toBe("#hash");
  expect(route.host).toBe("localhost:8000");
  expect(route.params.a).toBe("id");
});
