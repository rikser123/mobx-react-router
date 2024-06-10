import { makeAutoObservable } from "mobx";

import { RouteStore } from "./routeStore";
import { ConfigRoute, FlatPaths, NavigatePayload } from "./types";
import { findCurrentRoute, isEqual, createFlatPaths } from "./utils";

const DEFAULT_ROUTE_TEMPLATE = "/*";

class RouterStore {
  currentRoute: RouteStore = {} as RouteStore;
  config: ConfigRoute[] = [];
  flatPaths: FlatPaths = [];
  parentRoutes: ConfigRoute[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  private findParentPaths = (path: string) => {
    const currentChain =
      this.flatPaths.find((chain) =>
        chain.find((chainSegment) => chainSegment.path === path),
      ) ?? [];
    const currentPathIndex = currentChain.findIndex(
      (chainSegment) => chainSegment.path === path,
    );

    return currentChain.slice(0, currentPathIndex);
  };

  private setNewCurrentRoute = (currentPath: ConfigRoute) => {
    this.currentRoute = new RouteStore(
      `${location.origin}${location.pathname}${location.search}`,
      currentPath,
    );
    this.parentRoutes = this.findParentPaths(
      this.currentRoute.configRoute.path,
    );
  };

  private setDefaultRoute = () => {
    let defaultRoute: ConfigRoute | null | undefined = null;
    const parentWithDefaultRoute = this.parentRoutes.findLast((route) =>
      route.children?.find(
        (childRoute) => childRoute.path === DEFAULT_ROUTE_TEMPLATE,
      ),
    );
    if (parentWithDefaultRoute) {
      defaultRoute = parentWithDefaultRoute.children?.find(
        (route) => route.path === DEFAULT_ROUTE_TEMPLATE,
      );
    } else {
      defaultRoute = findCurrentRoute(DEFAULT_ROUTE_TEMPLATE, this.config);
    }

    if (defaultRoute) {
      this.currentRoute = new RouteStore(`${location.origin}/*`, defaultRoute);
    }
  };

  private updateExistedRoute = (currentPath: ConfigRoute) => {
    const newCurrentRoute = new RouteStore(
      `${location.origin}${location.pathname}${location.search}`,
      currentPath,
    );

    const isParamsEqual = isEqual(
      newCurrentRoute.params,
      this.currentRoute.params,
    );
    if (!isParamsEqual) {
      this.currentRoute.params = newCurrentRoute.params;
      this.currentRoute.pathname = newCurrentRoute.pathname;
    }
    const isSearchParamsEqual = isEqual(
      newCurrentRoute.searchParams,
      this.currentRoute.searchParams,
    );
    if (!isSearchParamsEqual) {
      this.currentRoute.searchParams = newCurrentRoute.searchParams;
      this.currentRoute.search = newCurrentRoute.search;
    }
  };

  setCurrentRoute = async () => {
    const currentPath = findCurrentRoute(location.pathname, this.config);

    if (!currentPath) {
      this.setDefaultRoute();
      return;
    }

    if (currentPath.beforeEnter) {
      await currentPath.beforeEnter?.(
        currentPath,
        this.currentRoute.configRoute ? this.currentRoute : undefined,
      );
    }

    if (!this.currentRoute.configRoute) {
      this.setNewCurrentRoute(currentPath);
      return;
    }

    if (currentPath.path !== this.currentRoute.configRoute.path) {
      const popStateEvent = new CustomEvent("popstate");
      window.dispatchEvent(popStateEvent);
      this.setNewCurrentRoute(currentPath);
      return;
    }

    this.updateExistedRoute(currentPath);
  };

  setInitialRoute = (paths: ConfigRoute[]) => {
    this.config = paths;
    this.flatPaths = createFlatPaths(paths);

    this.setCurrentRoute();
  };

  isRouteVisible = (currentRoute: ConfigRoute) =>
    this.currentRoute?.configRoute?.path === currentRoute.path ||
    this.parentRoutes.find((route) => route.path === currentRoute?.path);

  navigate = (payload: NavigatePayload) => {
    const { searchParams, pathname, replace, hash } = payload;
    const searchStr = searchParams
      ? `?${Object.entries(searchParams)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      : "";
    const hashStr = hash ? `#${hash}` : "";
    const link = `${pathname}${hashStr}${searchStr}`;

    if (replace) {
      history.replaceState(null, "", link);
    } else {
      history.pushState(null, "", link);
    }

    this.setCurrentRoute();
  };

  getSearchParams = <T extends Record<string, unknown>>() =>
    (this.currentRoute?.searchParams as T) ?? {};

  getParams = <T extends Record<string, unknown>>() =>
    (this.currentRoute?.params as T) ?? {};

  getMeta = <T extends Record<string, unknown>>() =>
    (this.currentRoute?.meta as T) ?? {};
}

export const routerStore = new RouterStore();
