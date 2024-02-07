import React, { FC, useEffect } from "react";
import { observer } from "mobx-react";

import { ConfigRoute } from "../types";
import { routerStore } from "../routerStore";

import { Route } from "./route";

export interface RouterProps {
  routes: ConfigRoute[];
}

export const Router: FC<RouterProps> = observer(({ routes }) => {
  useEffect(() => {
    routerStore.setInitialRoute(routes);

    window.addEventListener("popstate", routerStore.setCurrentRoute);

    return () =>
      window.removeEventListener("popstate", routerStore.setCurrentRoute);
  }, []);

  return (
    <>
      {routerStore.config.map((route) => (
        <Route route={route} key={route.path} />
      ))}
    </>
  );
});
