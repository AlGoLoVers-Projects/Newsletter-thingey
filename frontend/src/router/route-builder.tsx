import {RouteObject} from "react-router/dist/lib/context";
import ProtectedRoute from "./ProtectedRoute";
import React from "react";
import {Route, routes} from "./ApplicationRoutes";

export const buildRoutes = (): RouteObject[] => {
    return routes.map(({path, element, authorised}: Route) => {
        return {
            path,
            element: authorised ? <ProtectedRoute>{element}</ProtectedRoute> : element,
        };
    });
}