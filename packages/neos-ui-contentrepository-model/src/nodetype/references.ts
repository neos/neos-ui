import {PropertyScope} from '../node';

export interface ReferencesConfiguration {
    type?: string;
    scope?: PropertyScope;
    ui?: {
        label?: string;
        reloadIfChanged?: boolean;
        inspector?: {
            hidden?: boolean;
            editor?: string;
            editorOptions?: {
                [propName: string]: any;
            }
            group?: string;
            position?: number | string;
        };
        help?: {
            message?: string;
            thumbnail?: string;
        };
    };
}
