import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import Button from '@neos-project/react-ui-components/src/Button/';
import I18n from '@neos-project/neos-ui-i18n';

import style from './style.css';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    validatorRegistry: globalRegistry.get('validators')
}))
@connect((state, {nodeTypesRegistry, validatorRegistry}) => {
    const isApplyDisabledSelector = selectors.UI.Inspector.makeIsApplyDisabledSelector(nodeTypesRegistry, validatorRegistry);

    return {
        shouldAppear: selectors.UI.Inspector.shouldPromptToHandleUnappliedChanges(state),
        isApplyDisabled: isApplyDisabledSelector(state),
        isDiscardDisabled: selectors.UI.Inspector.isDiscardDisabledSelector(state),
        focusedNodeContextPath: selectors.CR.Nodes.focusedNodePathSelector(state)
    };
}, {
    resume: actions.UI.Inspector.resume,
    apply: actions.UI.Inspector.apply,
    discard: actions.UI.Inspector.discard
})
export default class UnappliedChangesDialog extends PureComponent {
    static propTypes = {
        shouldAppear: PropTypes.bool.isRequired,
        isApplyDisabled: PropTypes.bool.isRequired,
        isDiscardDisabled: PropTypes.bool.isRequired,

        resume: PropTypes.func.isRequired,
        discard: PropTypes.func.isRequired,
        apply: PropTypes.func.isRequired
    };

    handleResume = () => {
        const {resume} = this.props;

        resume();
    };

    handleDiscard = () => {
        const {discard} = this.props;

        discard(this.props.focusedNodeContextPath);
    };

    handleApply = () => {
        const {apply} = this.props;

        apply();
    };

    render() {
        const {shouldAppear, isDiscardDisabled, isApplyDisabled} = this.props;

        if (!shouldAppear) {
            return null;
        }

        return (
            <Dialog
                title={
                    <I18n
                        id="Neos.Neos:Main:content.inspector.unappliedChangesDialog.header"
                        fallback="You still have changes. What do you want to do with them?"
                        />
                }
                onRequestClose={this.handleResume}
                type="warn"
                isOpen
                id="neos-UnappliedChangesDialog"
                >
                <div className={style.modalContents}>
                    <Button
                        id="neos-UnappliedChangesDialog-discard"
                        style="lighter"
                        disabled={isDiscardDisabled}
                        onClick={this.handleDiscard}
                        className={`${style.button} ${style.discardButton}`}
                        >
                        <I18n id="Neos.Neos:Main:content.inspector.unappliedChangesDialog.button.danger"/>
                    </Button>
                    <Button
                        id="neos-UnappliedChangesDialog-resume"
                        style="lighter"
                        onClick={this.handleResume}
                        className={`${style.button} ${style.resumeButton}`}
                        >
                        <I18n id="Neos.Neos:Main:content.inspector.unappliedChangesDialog.button.default"/>
                    </Button>
                    <Button
                        id="neos-UnappliedChangesDialog-apply"
                        style="lighter"
                        disabled={isApplyDisabled}
                        onClick={this.handleApply}
                        className={`${style.button} ${style.publishButton}`}
                        >
                        <I18n id="Neos.Neos:Main:content.inspector.unappliedChangesDialog.button.success"/>
                    </Button>
                </div>
            </Dialog>
        );
    }
}
