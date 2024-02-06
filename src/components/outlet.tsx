import React, { FC } from "react";
import { observer } from "mobx-react";

import { ConfigRoute } from "../types";

import { Route } from "./route";

export interface OutletProps {
  route?: ConfigRoute;
}

export const Outlet: FC<OutletProps> = observer(({ route }) => (
  <>
    {route?.children?.map((route) => <Route route={route} key={route.path} />)}
  </>
));
