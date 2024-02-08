import { FC } from "react";
import { RouteStore } from "./routeStore";

export interface RouteComponentProps {
  route?: ConfigRoute;
}

export interface ConfigRoute {
  path: string;
  meta?: Record<string, unknown>;
  beforeEnter?: (
    configRoute: ConfigRoute,
    previousRoute?: RouteStore,
  ) => Promise<void>;
  component: FC<RouteComponentProps>;
  children?: ConfigRoute[];
}

export interface NavigatePayload {
  pathname: string;
  searchParams?: Record<string, string>;
  replace?: boolean;
  hash?: string;
}

export type FlatPaths = Array<ConfigRoute[]>;
