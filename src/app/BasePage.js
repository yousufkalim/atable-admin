import React, {Suspense} from "react";
import {Redirect, Switch} from "react-router-dom";
import {LayoutSplashScreen, ContentRoute} from "../_metronic/layout";
import {BuilderPage} from "./pages/BuilderPage";
import UserPage from "./pages/UserPage";
import RestaurantPage from "./pages/RestaurantPage";
import TablePage from "./pages/TablePage";
import {DashboardPage} from "./pages/DashboardPage";

export default function BasePage() {
    // useEffect(() => {
    //   console.log('Base page');
    // }, []) // [] - is required if you need only one call
    // https://reactjs.org/docs/hooks-reference.html#useeffect

    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <Switch>
                {
                    /* Redirect from root URL to /dashboard. */
                    <Redirect exact from="/" to="/dashboard"/>
                }
                <ContentRoute path="/dashboard" component={DashboardPage}/>
                <ContentRoute path="/builder" component={BuilderPage}/>
                <ContentRoute path="/user" component={UserPage} />
                <ContentRoute path="/restaurant" component={RestaurantPage} />
                <ContentRoute path="/table" component={TablePage} />
                <Redirect to="error/error-v1"/>
            </Switch>
        </Suspense>
    );
}
