import {createBrowserRouter} from "react-router-dom";
import {paths} from "./paths";
import App from "../App";

export const router = createBrowserRouter([
    {
        path: paths.home,
        element: <App/>,
    },
    {
        path: paths.login,
        element: <div>Login</div>,
    },
    {
        path: paths.oauthSuccess,
        element: <div>OAuthSuccess</div>
    },
    {
        path: paths.signup,
        element: <div>Singup</div>,
    },
]);