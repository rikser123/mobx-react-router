import React from "react";

import { ConfigRoute } from "../types";

export const routes: ConfigRoute[] = [
  {
    path: "/a",
    component: () => <div>a</div>,
  },
  {
    path: "/b",
    component: () => <div>b</div>,
  },
  {
    path: "/c",
    component: () => <div>c</div>,
    children: [
      {
        path: "/c/:id",
        component: () => <div>cc</div>,
      },
      {
        path: "/c/b",
        component: () => <div>ccc</div>,
        children: [
          {
            path: "/c/:a/bb",
            component: () => <div>cccc</div>,
          },
        ],
      },
    ],
  },
  {
    path: "/*",
    component: () => <div>b</div>,
  },
];
