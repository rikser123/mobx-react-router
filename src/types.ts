import { FC } from "react";

export interface RouteComponentProps {
  route?: ConfigRoute;
}

export interface ConfigRoute {
  path: string;
  meta?: Record<string, unknown>;
  beforeEnter?: () => void;
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
