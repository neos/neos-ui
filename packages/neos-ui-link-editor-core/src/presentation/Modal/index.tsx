import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Dialog} from '@neos-project/react-ui-components';
import {ReactNode} from "react";

//
// TODO: Dear Reader:
// The styled component below this comment is a desparate hack
// to let the native Neos UI Dialog position in center,
// calculate its width by its contents and allow for more height,
// which is behavior that the Dialog does not anticipate.
//
// This is a **VERY FRAGILE** hack, so please do not copy it. A
// fix for the native Dialog in Neos UI will follow soon.
//
/*
    z-index: 69;

    [class*="_dialog__contentsPosition "],
    [class$="_dialog__contentsPosition"] {
        top: 50%;
        transform: translateY(-50%)translateX(-50%)scale(1);
    }
    [class*="_dialog__contents "],
    [class$="_dialog__contents"] {
        width: auto;
        max-width: calc(100vw - 40px * 2);
    }
    [class*="_dialog__body "],
    [class$="_dialog__body"] {
        max-height: 80vh;
    }
*/

export const Modal: React.FC<{
    title: React.ReactNode
    renderBody(): React.ReactNode,
    onRequestClose(): void,
    preventClosing: boolean,
    actions: ReadonlyArray<ReactNode>;
}> = props => ReactDOM.createPortal(
    <Dialog
        id="neos-LinkEditor"
        isOpen={true}
        title={props.title}
        onRequestClose={props.onRequestClose}
        preventClosing={props.preventClosing}
        style="jumbo"
        actions={props.actions}
        autoFocus={true}
    >
        {props.renderBody()}
    </Dialog>,
    document.body
);
