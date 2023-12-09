import React, {Suspense} from "react";
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {AuthorizedPaths, UnauthorizedPaths} from "./path";
import AuthorizedRouter from "./authorized-router";
import App from "../App";

export default function RootRouter(): React.ReactElement {

    let authorized = true;

    return (
        <BrowserRouter>
            <Suspense
                fallback={
                    <div>
                        Loading...
                    </div>
                }
            >
                <Switch>
                    <Route
                        path={UnauthorizedPaths.login}
                        exact
                        render={() => <div>login</div>}
                    />
                    <Route
                        path={AuthorizedPaths.home}
                        exact
                        render={() => <App/>}
                    />
                    <Route
                        path={"/oAuth2Error"}
                        exact
                        render={() => <App/>}
                    />
                    {authorized && (
                        <Route render={() => <AuthorizedRouter/>}/>
                    )}
                    {authorized ? (
                        <Switch>
                            <Redirect to={AuthorizedPaths.home}/>
                            <Redirect path="/" to={AuthorizedPaths.home}/>
                        </Switch>
                    ) : (
                        <Switch>
                            <Redirect to={UnauthorizedPaths.login}/>
                            <Redirect path="*" to={UnauthorizedPaths.login}/>
                        </Switch>
                    )}
                </Switch>
            </Suspense>
        </BrowserRouter>
    )

}