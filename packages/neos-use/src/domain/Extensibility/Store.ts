import * as React from "react";
export interface IState {
    cr?: {
        nodes?: {
            siteNode?: string;
            documentNode?: string;
        };
        workspaces?: {
            personalWorkspace?: {
                name: string;
            };
        };
        contentDimensions?: {
            active: null | Record<string, string[]>;
        };
    };
    ui?: {
        pageTree?: {
            query?: string;
            filterNodeType?: string;
        };
    };
    system?: {
        authenticationTimeout?: boolean;
    };
}
