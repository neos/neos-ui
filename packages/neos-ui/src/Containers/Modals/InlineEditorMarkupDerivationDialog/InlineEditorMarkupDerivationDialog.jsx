import React from 'react';
import {connect} from 'react-redux';

import {actions} from '@neos-project/neos-ui-redux-store';
import {Button, Dialog, Icon} from '@neos-project/react-ui-components';
import I18n from '@neos-project/neos-ui-i18n';

import style from './style.module.css';

const withReduxState = connect((state) => ({
    isOpen: state?.ui?.inlineEditorMarkupDerivationDialog?.isOpen
}), {
    onCancel: actions.UI.InlineEditorMarkupDerivationDialog.cancel,
    onConfirm: actions.UI.InlineEditorMarkupDerivationDialog.confirm
});

export const InlineEditorMarkupDerivationDialog = withReduxState((props) => {
    if (!props.isOpen) {
        return null;
    }

    return (
        <Dialog
            actions={[
                <Button
                    key="cancel"
                    style="lighter"
                    hoverStyle="brand"
                    onClick={props.onCancel}
                >
                    <I18n
                        id="Neos.Neos.Ui:InlineEditorMarkupDerivationDialog:cancel"
                        fallback="Cancel"
                    />
                </Button>,
                <Button
                    key="confirm"
                    style="warn"
                    hoverStyle="warn"
                    onClick={props.onConfirm}
                >
                    <Icon icon="i-cursor" className={style.buttonIcon} />
                    <I18n
                        id="Neos.Neos.Ui:InlineEditorMarkupDerivationDialog:confirm"
                        fallback="Edit"
                    />
                </Button>
            ]}
            title={<div>
                <Icon icon="highlighter"/>
                <span className={style.modalTitle}>
                    <I18n
                        id="Neos.Neos.Ui:InlineEditorMarkupDerivationDialog:title"
                        fallback="Unexpected formatting in text"
                    />
                </span>
            </div>}
            onRequestClose={props.onCancel}
            type="warn"
            isOpen
            autoFocus
        >
            <div className={style.modalContents}>
                <I18n
                    id="Neos.Neos.Ui:InlineEditorMarkupDerivationDialog:message"
                    fallback="By editing this text its formatting might partially be lost."
                />
            </div>
        </Dialog>
    );
});
