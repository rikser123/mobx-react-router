import { makeAutoObservable } from "mobx";

import { RouteStore } from "./routeStore";
import { ConfigRoute, FlatPaths, NavigatePayload } from "./types";
import { findCurrentRoute, isEqual, createFlatPaths } from "./utils";

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
            this.flatPaths.find((chain) => chain.find((chainSegment) => chainSegment.path === path)) ?? [];
        const currentPathIndex = currentChain.findIndex((chainSegment) => chainSegment.path === path);

        return currentChain.slice(0, currentPathIndex);
    };

    private setNewCurrentRoute = (currentPath: ConfigRoute) => {
        this.currentRoute = new RouteStore(`${location.origin}${location.pathname}${location.search}`, currentPath);
        this.parentRoutes = this.findParentPaths(this.currentRoute.configRoute.path);
    };

    private setDefaultRoute = () => {
        const defaultRoute = findCurrentRoute("*", this.config);
        if (defaultRoute) {
            this.currentRoute = new RouteStore(`${location.origin}/*`, defaultRoute);
        }
    };

    setCurrentRoute = () => {
        const currentPath = findCurrentRoute(location.pathname, this.config);

        if (!currentPath) {
            this.setDefaultRoute();
            return;
        }

        if (!this.currentRoute.configRoute) {
            this.setNewCurrentRoute(currentPath);
            return;
        }

        const newCurrentRoute = new RouteStore(`${location.origin}${location.pathname}${location.search}`, currentPath);

        if (currentPath.path !== this.currentRoute.configRoute.path) {
            this.setNewCurrentRoute(currentPath);
            return;
        }

        const isParamsEqual = isEqual(newCurrentRoute.params, this.currentRoute.params);
        if (!isParamsEqual) {
            this.currentRoute.params = newCurrentRoute.params;
            this.currentRoute.pathname = newCurrentRoute.pathname;
        }
        const isSeachParamsEqual = isEqual(newCurrentRoute.searchParams, this.currentRoute.searchParams);
        if (!isSeachParamsEqual) {
            this.currentRoute.searchParams = newCurrentRoute.searchParams;
            this.currentRoute.search = newCurrentRoute.search;
        }
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

    getSearchParams = <T extends Record<string, unknown>>() => (this.currentRoute?.searchParams as T) ?? {};

    getParams = <T extends Record<string, unknown>>() => (this.currentRoute?.params as T) ?? {};

    getMeta = <T extends Record<string, unknown>>() => (this.currentRoute?.meta as T) ?? {};
}

export const routerStore = new RouterStore();
