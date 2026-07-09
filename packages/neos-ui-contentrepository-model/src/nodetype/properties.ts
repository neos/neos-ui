import {PropertyScope} from '../node';
import {ValidatorConfiguration} from './validators';

export interface PropertyConfiguration {
    type?: string;
    scope?: PropertyScope;
    ui?: {
        label?: string;
        reloadIfChanged?: boolean;
        inline?: {
            editor?: string;
            editorOptions?: {
                [propName: string]: any;
            };
        }
        inlineEditable?: boolean;
        inspector?: {
            hidden?: boolean;
            defaultValue?: string;
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
        aloha?: any; // deprecated format
    };
    validation?: {
        [propName: string]: ValidatorConfiguration | undefined;
    };
}
