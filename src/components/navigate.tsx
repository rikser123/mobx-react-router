import React, { FC, useEffect } from "react";

import { routerStore } from "../routerStore";

interface NavigateProps {
  path: string;
}

export const Navigate: FC<NavigateProps> = ({ path }) => {
  useEffect(() => {
    routerStore.navigate({ pathname: path });
  }, [path]);

  return null;
};
