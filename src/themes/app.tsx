import * as React from "react";
import { Router } from "@paperbits/common/routing";
import { Resolve } from "@paperbits/react/decorators";


export class ReactApp extends React.Component {
    @Resolve("router")
    public router: Router; // Here we inject the router by registered name

    public render(): JSX.Element {
        return (
            <h1>
                My React app. Current route: {this.router.getCurrentUrl()}
            </h1>
        );
    }
}