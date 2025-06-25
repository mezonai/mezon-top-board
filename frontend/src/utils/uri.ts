import { matchRoutes, RouteObject } from "react-router-dom";

export function getRouteMatchPath(
    routes: RouteObject[],
    location: Partial<Location> | string
) {
    const matches = matchRoutes(routes, location);
    const getPath = (route: RouteObject) => {
        let path = route.path!;
        if (route.children?.length) {
            path += getPath(route.children[0]);
        }
        return path;
    };
    if (matches?.length) {
        return getPath(matches[0].route);
    }
    return null;
}

export const getPageFromParams = (params: URLSearchParams) => {
  const param = parseInt(params.get('page') || '1', 10);
  return isNaN(param) || param < 1 ? 1 : param;
};
