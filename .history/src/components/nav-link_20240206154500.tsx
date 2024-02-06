import React, { FC, ReactNode, MouseEvent, LinkHTMLAttributes } from "react";
import classNames from "classnames";
import { observer } from "mobx-react";

import { routerStore } from "../routerStore";

type NavLinkProps = Omit<LinkHTMLAttributes<HTMLAnchorElement>, "className"> & {
    children?: ReactNode;
    path: string;
    className?: string | ((props: { isActive: boolean }) => string);
};

export const NavLink: FC<NavLinkProps> = observer(({ children, path, className, ...rest }) => {
    const isActive = routerStore.currentRoute.pathname.includes(path);

    const handleClick = (event: MouseEvent) => {
        event.preventDefault();
        routerStore.navigate({ pathname: path });
    };

    const classNameTotal = typeof className === "function" ? className({ isActive }) : classNames(className);

    return (
        <a
            href="#"
            className={classNameTotal}
            onClick={handleClick}
            {...rest}
        >
            {children}
        </a>
    );
});
