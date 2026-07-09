import {PropertyConfiguration} from './properties';
import {ReferencesConfiguration} from './references';

export interface NodeType {
    name?: string;
    superTypes: {
        [propName: string]: boolean | undefined;
    };
    constraints: {
        nodeTypes: {
            [propName: string]: boolean | undefined;
        }
    };
    label?: string;
    ui?: {
        group?: string;
        icon?: string;
        label?: string;
        position?: number | string;
        inlineEditable?: boolean;
        inspector?: {
            groups?: {
                [propName: string]: {
                    title?: string;
                    label?: string;
                    icon?: string;
                    tab?: string;
                    position?: number | string;
                    collapsed?: boolean;
                } | undefined;
            };
            tabs?: {
                [propName: string]: {
                    label?: string;
                    position?: number | string;
                    icon?: string;
                } | undefined;
            };
            views?: {
                [propName: string]: {
                    group?: string;
                    label?: string;
                    position?: number | string;
                    helpMessage?: string;
                    view?: string;
                    viewOptions?: {
                        [propName: string]: any;
                    };
                }
            };
        };
        creationDialog?: {
            elements?: {
                [propName: string]: {
                    type?: string;
                    ui?: {
                        hidden?: boolean | string;
                        label?: string;
                        editor?: string;
                        editorOptions?: {
                            [propName: string]: any;
                        };
                    };
                    validation?: {
                        [propName: string]: {
                            [propName: string]: any;
                        };
                    };
                };
            };
        };
    };
    properties?: {
        [propName: string]: PropertyConfiguration | undefined;
    };
    references?: {
        [referenceName: string]: ReferencesConfiguration | undefined;
    };
}
