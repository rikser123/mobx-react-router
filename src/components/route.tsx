import React, { FC } from "react";
import { observer } from "mobx-react";

import { ConfigRoute } from "../types";
import { routerStore } from "../routerStore";

interface RouteProps {
  route: ConfigRoute;
}

export const Route: FC<RouteProps> = observer(({ route }) => {
  const { isRouteVisible } = routerStore;
  const Component = route.component;

  return isRouteVisible(route) ? <Component route={route} /> : null;
});
