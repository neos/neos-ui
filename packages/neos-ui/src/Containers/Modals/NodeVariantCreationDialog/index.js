import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';

import Button from '@neos-project/react-ui-components/lib/Button/';
import Dialog from '@neos-project/react-ui-components/lib/Dialog/';
import I18n from '@neos-project/neos-ui-i18n';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.css';

@connect($transform({
    isOpen: selectors.UI.NodeVariantCreationDialog.isOpen,
    numberOfParentNodesToBeCreated: selectors.UI.NodeVariantCreationDialog.numberOfParentNodesToBeCreated
}), {
    cancel: actions.UI.NodeVariantCreationDialog.cancel,
    createEmpty: actions.UI.NodeVariantCreationDialog.createEmpty,
    createAndCopy: actions.UI.NodeVariantCreationDialog.createAndCopy
})
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class NodeVariantCreationDialog extends PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        numberOfParentNodesToBeCreated: PropTypes.number.isRequired,

        cancel: PropTypes.func.isRequired,
        createEmpty: PropTypes.func.isRequired,
        createAndCopy: PropTypes.func.isRequired
    };

    handleAbort = () => {
        const {cancel} = this.props;

        cancel();
    }

    handleCreateEmpty = () => {
        const {createEmpty} = this.props;

        createEmpty();
    }

    handleCreateAndCopy = () => {
        const {createAndCopy} = this.props;

        createAndCopy();
    }

    renderTitle() {
        return (
            <div>
                <span className={style.modalTitle}>
                    Start with an empty or pre-filled document?
                </span>
            </div>
        );
    }

    renderAbort() {
        return (
            <Button
                key="cancel"
                style="lighter"
                hoverStyle="brand"
                onClick={this.handleAbort}
                >
                <I18n id="Neos.Neos:Main:cancel" fallback="Cancel"/>
            </Button>
        );
    }

    renderCreateEmpty() {
        return (
            <Button
                key="createEmpty"
                style="warn"
                hoverStyle="brand"
                onClick={this.handleCreateEmpty}
                >
                Create empyt TODO
            </Button>
        );
    }

    renderCreateAndCopy() {
        return (
            <Button
                key="createAndCopy"
                style="warn"
                hoverStyle="brand"
                onClick={this.handleCreateAndCopy}
                >
                Create and copy TODO
            </Button>
        );
    }

    render() {
        const {isOpen, numberOfParentNodesToBeCreated} = this.props;

        if (!isOpen) {
            return null;
        }

        return (
            // TODO: anchestor documents!!
            <Dialog
                actions={[this.renderAbort(), this.renderCreateEmpty(), this.renderCreateAndCopy()]}
                title={this.renderTitle()}
                onRequestClose={this.handleAbort}
                isOpen
                >
                <div className={style.modalContents}>
                    This TODO does not exist yet in Language German.
You can create it now, either starting with an empty TODO or copying all content from the currently visible TODO in .
{numberOfParentNodesToBeCreated > 0 ?
    <span>Additionally, there are {numberOfParentNodesToBeCreated} ancestor documents which do not exist in the chosen variant either, and which will be created as well.</span> : null
}
                </div>
            </Dialog>
        );
    }
}
