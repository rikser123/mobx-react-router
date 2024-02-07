# mobx-react-router
### Example
```javascript
const routes: ConfigRoute[] = [
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
    component: (props) =>
    <>
      <div>c</div>
      <Outlet {...props}/> // child routes
    </>,
    children: [
      {
        path: "/c/:id", // dynamic path
        component: (props) =>  
        <>
          <div>cc</div>
          <Outlet {...props}/>
        </>,
      },
      {
        path: "/c/b",
        component: (props) => 
        <>
          <div>ccx</div>
          <Outlet {...props}/>
        </>,
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
    path: "/*", // default route
    component: () => <div>b</div>,
  },
];

<Router routes={routes}/>
```
### Public Api

#### routerStore
|   |   |
| ------------ | ------------ |
| **currentRoute**  | `RouteStore`  |
| **getSearchParams**  | `Record<string, unknown>`  |
| ** getParams** | `Record<string, unknown>`  |
| **getMeta**  | `Record<string, unknown>`  |
| **navigate**  | `NavigatePayload`  |
```javascript
export interface NavigatePayload {
  pathname: string;
  searchParams?: Record<string, string>;
  replace?: boolean;
  hash?: string;
}
```
#### Route
|   |   |
| ------------ | ------------ |
| **navigate**  |  `string` |
| **host**  |  `string` |
| **hostname**  |  `string` |
| **href**  |  `string` |
| **origin**  |  `string` |
| **password**  |  `string` |
| **pathname**  |  `string` |
| **port**  |  `string` |
| **protocol**  |  `string` |
| **search**  |  `string` |
| **username**  |  `string` |
| **searchParams**  |  `Record<string, unknown>` |
| **params**  |  `Record<string, unknown>` |
| **configRoute**  |  `ConfigRoute` |
```javascript
interface ConfigRoute {
  path: string;
  meta?: Record<string, string>;
  beforeEnter?: () => void;
  component: FC<RouteComponentProps>;
  children?: ConfigRoute[];
}
```
### Components
#### NavLink
```javascript
type NavLinkProps = Omit<LinkHTMLAttributes<HTMLAnchorElement>, "className"> & {
  children?: ReactNode;
  path: string;
  className?: string | ((props: { isActive: boolean }) => string);
};
```
#### Navigate
```javascript
interface NavigateProps {
  path: string;
}
```
#### Outlet
```javascript
export interface OutletProps {
  route?: ConfigRoute;
}
```
#### Router
```javascript
export interface RouterProps {
  routes: ConfigRoute[];
}
```
