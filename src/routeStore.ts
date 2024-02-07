import { makeAutoObservable } from "mobx";

import { ConfigRoute } from "./types";

export class RouteStore {
  hash = "";
  host = "";
  hostname = "";
  href = "";
  origin = "";
  password = "";
  pathname = "";
  port = "";
  protocol = "";
  search = "";
  username = "";
  searchParams: Record<string, string> = {};
  params: Record<string, unknown> = {};
  meta?: Record<string, unknown> = {};
  configRoute: ConfigRoute = {} as ConfigRoute;

  constructor(link?: string, currentPath?: ConfigRoute) {
    if (!link && !currentPath) {
      return;
    }

    const url = new URL(link ?? "");

    makeAutoObservable(this);
    this.parseLink(url);
    this.configRoute = currentPath ?? ({} as ConfigRoute);
    this.parseParams(url.pathname, this.configRoute.path);
    this.meta = this.configRoute.meta;
  }

  private parseLink = (url: URL) => {
    this.hash = url.hash;
    this.host = url.host;
    this.hostname = url.hostname;
    this.href = url.href;
    this.origin = url.origin;
    this.password = url.password;
    this.pathname = url.pathname;
    this.port = url.port;
    this.protocol = url.protocol;
    this.search = url.search;
    this.username = url.username;

    for (const [key, value] of url.searchParams.entries()) {
      this.searchParams[key] = value;
    }
  };

  private parseParams = (pathname: string, pathTemplate: string) => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const templateSegments = pathTemplate.split("/").filter(Boolean);

    templateSegments.forEach((segment, index) => {
      const isDynamic = segment.startsWith(":");
      const pathSegment = pathSegments[index];

      if (isDynamic && pathSegment) {
        const segmentName = segment.slice(
          1,
          segment.endsWith("?") ? segment.length - 1 : segment.length,
        );
        this.params[segmentName] = pathSegment;
      }
    });
  };
}
