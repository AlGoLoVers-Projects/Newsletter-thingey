import {authorizedPaths, Path, paths} from "./paths";
import React from "react";
import Home from "../pages/home/Home";
import SingIn from "../pages/authentication/local-auth/SignIn";
import Dashboard from "../pages/dashboard/Dashboard";
import SignUp from "../pages/authentication/local-auth/SignUp";
import Verification from "../pages/authentication/local-auth/Verification";
import SignOut from "../pages/authentication/local-auth/SignOut";
import {useRoutes} from "react-router-dom";
import {buildRoutes} from "./route-builder";
import OAuth2Success from "../pages/authentication/oauth/OAuth2Success";
import OAuth2Failure from "../pages/authentication/oauth/OAuth2Failure";
import ForgotPassword from "../pages/authentication/local-auth/ForgotPassword";
import ResetPassword from "../pages/authentication/local-auth/ResetPassword";
import NewGroup from "../pages/dashboard/sub-pages/group/NewGroup";
import QuestionForm from "../pages/dashboard/sub-pages/questions/QuestionForm";
import {RedirectPathProvider} from "../components/elements/RedirectProvider";

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
        path: paths.test,
        element: <NewGroup/>,
        authorised: false
    },
    {
        path: paths.signIn,
        element:
            <RedirectPathProvider>
                <SingIn/>
            </RedirectPathProvider>,
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
        path: paths.forgotPassword,
        element: <ForgotPassword/>,
        authorised: false
    },
    {
        path: paths.resetPassword,
        element: <ResetPassword/>,
        authorised: false
    },
    {
        path: authorizedPaths.dashboard,
        element: <Dashboard/>,
        authorised: true
    },
    {
        path: authorizedPaths.form,
        element: <QuestionForm/>,
        authorised: true
    }
];

export default function ApplicationRoutes() {
    return useRoutes(buildRoutes())
}