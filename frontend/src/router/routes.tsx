import {authorizedPaths, Path, paths} from "./paths";
import React from "react";
import Home from "../pages/home/Home";
import SingIn from "../pages/authentication/SignIn";
import OAuth2Success from "../pages/authentication/OAuth2Success";
import OAuth2Failure from "../pages/authentication/OAuth2Failure";
import Dashboard from "../pages/dashboard/Dashboard";
import SignUp from "../pages/authentication/SignUp";
import Verification from "../pages/authentication/Verification";
import SignOut from "../pages/authentication/SignOut";
import {useRoutes} from "react-router-dom";
import {buildRoutes} from "./route-builder";

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
        path: paths.signIn,
        element: <SingIn/>,
        authorised: false
    },
    {
        path: paths.signUp,
        element: <SignUp/>,
        authorised: false
    },
    {
        path: authorizedPaths.signOut,
        element: <SignOut/>,
        authorised: true
    },
    {
        path: paths.verification,
        element: <Verification/>,
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
];

export default function Routes() {
    return useRoutes(buildRoutes())
}