import {authorizedPaths, Path, paths} from "./paths";
import React from "react";
import ProtectedRoute from "./ProtectedRoute";
import {RouteObject} from "react-router/dist/lib/context";


type Route = {
    path: Path,
    element: React.ReactNode,
    authorised: boolean
}

type Routes = Route[]

const routes: Routes = [
    {
        path: paths.home,
        element: <div>Home</div>,
        authorised: false
    },
    {
        path: paths.login,
        element: <div>Login</div>,
        authorised: false
    },
    {
        path: paths.signup,
        element: <div>Signup</div>,
        authorised: false
    },
    {
        path: paths.oauthSuccess,
        element: <div>OAuthSuccess</div>,
        authorised: false
    },
    {
        path: paths.oauth2Failure,
        element: <div>OAuthFailure</div>,
        authorised: false
    },
    {
        path: authorizedPaths.dashboard,
        element: <div>Dash Board</div>,
        authorised: true
    },
    {
        path: paths.notFound,
        element: <div>Page not found!</div>,
        authorised: false
    }
];

export const buildRoutes = (): RouteObject[] => {
    return routes.map(({path, element, authorised}) => {
        return {
            path,
            element: authorised ? <ProtectedRoute>{element}</ProtectedRoute> : element,
        };
    });
}