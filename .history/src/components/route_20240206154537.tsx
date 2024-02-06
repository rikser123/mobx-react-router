import React, { FC } from "react";
import { observer } from "mobx-react";
import { LoadingSuspense } from "@rikser/learning-design-system";

import { ConfigRoute } from "../types";
import { routerStore } from "../routerStore";

interface RouteProps {
    route: ConfigRoute;
}

export const Route: FC<RouteProps> = observer(({ route }) => {
    const { isRouteVisible } = routerStore;
    const Component = route.component;

    return isRouteVisible(route) ? (
        <LoadingSuspense isPage>
            <Component route={route} />
        </LoadingSuspense>
    ) : null;
});
