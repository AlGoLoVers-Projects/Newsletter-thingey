import {authorizedPaths, Path, paths} from "./paths";
import React from "react";

export type Route = {
    path: Path,
    element: React.ReactNode,
    authorised: boolean
}

export type Routes = Route[]

export const routes: Routes = [
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