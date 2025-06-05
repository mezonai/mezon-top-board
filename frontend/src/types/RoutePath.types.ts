import { JSX } from "react";

export type RoutePath = {
    index?: boolean;
    path: string;
    element?: JSX.Element;
    children?: RoutePath[];
    strLabel: string;
    label?: JSX.Element;
    isShowMenu?: boolean;
    icon?: JSX.Element;
    requireAuth?: boolean;
    isExternal?: boolean;
}