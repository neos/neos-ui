/**
 * @deprecated PLEASE DON'T ADD NEW THINGS HERE
 * Rather extract types to well structures subpackages.
 * The types belong to the source files directly.
 */

import {NodeContextPath} from '@neos-project/neos-ui-contentrepository-model';

export type FusionPath = string;

export enum ClipboardMode {
    COPY = 'Copy',
    MOVE = 'Move'
}

export enum InsertPosition {
    INTO = 'into',
    BEFORE = 'before',
    AFTER = 'after'
}

export enum SelectionModeTypes {
    SINGLE_SELECT = 'SINGLE_SELECT',
    MULTIPLE_SELECT = 'MULTIPLE_SELECT',
    RANGE_SELECT = 'RANGE_SELECT'
}

//
// Change object from our Changes API
//
export interface Change extends Readonly<{
    type: string;
    subject: NodeContextPath;
    payload: {
        propertyName: string;
        value: any;
    };
}> {}
