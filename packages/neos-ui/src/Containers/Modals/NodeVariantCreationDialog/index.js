import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Button, Dialog} from '@neos-project/react-ui-components';
import {translate} from '@neos-project/neos-ui-i18n';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.module.css';

@connect(state => ({
    isOpen: selectors.UI.NodeVariantCreationDialog.isOpen(state),
    numberOfParentNodesToBeCreated: selectors.UI.NodeVariantCreationDialog.numberOfParentNodesToBeCreated(state),
    contentDimensions: selectors.CR.ContentDimensions.byName(state),
    activePresets: selectors.CR.ContentDimensions.activePresets(state),
    documentNode: selectors.CR.Nodes.documentNodeSelector(state)
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
        contentDimensions: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
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
                    {translate('Neos.Neos.Ui:Main:dimension.createDialog.header', 'Start with an empty or pre-filled document?')}
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
                {translate('Neos.Neos.Ui:Main:cancel', 'Cancel')}
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
                {translate('Neos.Neos.Ui:Main:dimension.createDialog.createEmpty', 'Create empty')}
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
                {translate('Neos.Neos.Ui:Main:dimension.createDialog.createAndCopy', 'Create and copy')}
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
            const dimensionLabel = i18nRegistry.translate(contentDimensions?.[dimensionName]?.label);
            const dimensionValueLabel = i18nRegistry.translate(dimensionConfig?.label);

            if (currentDimensionChoiceText) {
                currentDimensionChoiceText += ', ';
            }
            currentDimensionChoiceText += `${dimensionLabel} ${dimensionValueLabel}`;
        });

        const nodeType = nodeTypesRegistry.get(documentNode?.nodeType);

        const i18nParams = {
            currentDimensionChoiceText,
            currentDocumentDimensionChoiceText: currentDimensionChoiceText,
            nodeTypeLabel: i18nRegistry.translate(nodeType?.label)
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
                        {translate('Neos.Neos.Ui:Main:dimension.createDialog.nodeTypeDoesNotExistInDimension', '', i18nParams)}
                    </div>

                    <div>
                        {translate('Neos.Neos.Ui:Main:dimension.createDialog.createEmptyOrCopy', '', i18nParams)}
                    </div>
                    {numberOfParentNodesToBeCreated > 0 ?
                        <div>
                            {translate('Neos.Neos.Ui:Main:dimension.createDialog.existingAncestorDocuments', '', {numberOfNodesMissingInRootline: numberOfParentNodesToBeCreated})}
                        </div> : null
                    }
                </div>
            </Dialog>
        );
    }
}
