import {authorizedPaths, Path, paths} from "./paths";
import React from "react";
import Home from "../pages/home/Home";
import Login from "../pages/authentication/Login";
import Signup from "../pages/authentication/Signup";
import OAuth2Success from "../pages/authentication/OAuth2Success";
import OAuth2Failure from "../pages/authentication/OAuth2Failure";
import Dashboard from "../pages/dashboard/Dashboard";
import PageNotFound from "../pages/errors/NotFoundPage";

export type Route = {
    path: Path,
    element: React.ReactNode,
    authorised: boolean
}

export type Routes = Route[]

export const routes: Routes = [
    {
        path: paths.home,
        element: <Home/>,
        authorised: false
    },
    {
        path: paths.login,
        element: <Login/>,
        authorised: false
    },
    {
        path: paths.signup,
        element: <Signup/>,
        authorised: false
    },
    {
        path: paths.oauthSuccess,
        element: <OAuth2Success/>,
        authorised: false
    },
    {
        path: paths.oauth2Failure,
        element: <OAuth2Failure/>,
        authorised: false
    },
    {
        path: authorizedPaths.dashboard,
        element: <Dashboard/>,
        authorised: true
    },
    {
        path: paths.notFound,
        element: <PageNotFound/>,
        authorised: false
    }
];