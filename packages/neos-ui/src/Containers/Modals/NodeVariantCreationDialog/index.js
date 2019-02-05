import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import Button from '@neos-project/react-ui-components/src/Button/';
import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import I18n from '@neos-project/neos-ui-i18n';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.css';

@connect($transform({
    isOpen: selectors.UI.NodeVariantCreationDialog.isOpen,
    numberOfParentNodesToBeCreated: selectors.UI.NodeVariantCreationDialog.numberOfParentNodesToBeCreated,
    contentDimensions: selectors.CR.ContentDimensions.byName,
    activePresets: selectors.CR.ContentDimensions.activePresets,
    documentNode: selectors.CR.Nodes.documentNodeSelector
}), {
    cancel: actions.UI.NodeVariantCreationDialog.cancel,
    createEmpty: actions.UI.NodeVariantCreationDialog.createEmpty,
    createAndCopy: actions.UI.NodeVariantCreationDialog.createAndCopy
})
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class NodeVariantCreationDialog extends PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        numberOfParentNodesToBeCreated: PropTypes.number,
        contentDimensions: PropTypes.object.isRequired,
        activePresets: PropTypes.object.isRequired,
        documentNode: PropTypes.object.isRequired,

        cancel: PropTypes.func.isRequired,
        createEmpty: PropTypes.func.isRequired,
        createAndCopy: PropTypes.func.isRequired,

        nodeTypesRegistry: PropTypes.object.isRequired,
        i18nRegistry: PropTypes.object.isRequired
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
                    <I18n id="Neos.Neos:Main:content.dimension.createDialog.header" fallback="Start with an empty or pre-filled document?"/>
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
                id="neos-NodeVariantCreationDialog-CreateEmpty"
                key="createEmpty"
                style="lighter"
                hoverStyle="brand"
                onClick={this.handleCreateEmpty}
                >
                <I18n id="Neos.Neos:Main:content.dimension.createDialog.createEmpty" fallback="Create empty"/>
            </Button>
        );
    }

    renderCreateAndCopy() {
        return (
            <Button
                id="neos-NodeVariantCreationDialog-CreateAndCopy"
                key="createAndCopy"
                style="lighter"
                hoverStyle="brand"
                onClick={this.handleCreateAndCopy}
                >
                <I18n id="Neos.Neos:Main:content.dimension.createDialog.createAndCopy" fallback="Create and copy"/>
            </Button>
        );
    }

    render() {
        const {isOpen, numberOfParentNodesToBeCreated, i18nRegistry, activePresets, contentDimensions, documentNode, nodeTypesRegistry} = this.props;

        if (!isOpen) {
            return null;
        }

        let currentDimensionChoiceText = '';
        Object.keys(activePresets).forEach(dimensionName => {
            const dimensionConfig = activePresets[dimensionName];
            const dimensionLabel = i18nRegistry.translate($get([dimensionName, 'label'], contentDimensions));
            const dimensionValueLabel = i18nRegistry.translate($get('label', dimensionConfig));

            if (currentDimensionChoiceText) {
                currentDimensionChoiceText += ', ';
            }
            currentDimensionChoiceText += `${dimensionLabel} ${dimensionValueLabel}`;
        });

        const nodeType = nodeTypesRegistry.get($get('nodeType', documentNode));

        const i18nParams = {
            currentDimensionChoiceText,
            currentDocumentDimensionChoiceText: currentDimensionChoiceText,
            nodeTypeLabel: i18nRegistry.translate($get('label', nodeType))
        };

        return (
            <Dialog
                actions={[this.renderAbort(), this.renderCreateEmpty(), this.renderCreateAndCopy()]}
                title={this.renderTitle()}
                onRequestClose={this.handleAbort}
                isOpen
                id="neos-NodeVariantCreationDialog"
                >
                <div className={style.modalContents}>
                    <div>
                        <I18n id="Neos.Neos:Main:content.dimension.createDialog.nodeTypeDoesNotExistInDimension" fallback="TODO" params={i18nParams}/>
                    </div>

                    <div>
                        <I18n id="Neos.Neos:Main:content.dimension.createDialog.createEmptyOrCopy" fallback="TODO" params={i18nParams}/>
                    </div>
                    {numberOfParentNodesToBeCreated > 0 ?
                        <div><I18n id="Neos.Neos:Main:content.dimension.createDialog.existingAncestorDocuments" fallback="TODO" params={{numberOfNodesMissingInRootline: numberOfParentNodesToBeCreated}}/></div> : null
                    }
                </div>
            </Dialog>
        );
    }
}
