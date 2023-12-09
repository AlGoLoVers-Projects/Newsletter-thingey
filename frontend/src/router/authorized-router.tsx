import React, {lazy} from "react";
import {Route, Switch} from 'react-router-dom';
import {AuthorizedPaths} from "./path";

export default function AuthorizedRouter(): React.ReactElement {
    return (
        <Switch>
            <Route
                path={AuthorizedPaths.home}
                exact
                render={() => <div>Home</div>}
            />
        </Switch>
    )

}