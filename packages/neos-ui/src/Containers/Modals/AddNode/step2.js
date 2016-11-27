import React, {PureComponent, PropTypes} from 'react';
import {$get} from 'plow-js';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Dialog from '@neos-project/react-ui-components/lib/Dialog/';
import I18n from '@neos-project/neos-ui-i18n';
import validate from '@neos-project/neos-ui-validators/src/index';
import EditorEnvelope from '@neos-project/neos-ui-editors/src/EditorEnvelope/index';

export default class Step2 extends PureComponent {
    static propTypes = {
        selectedNodeType: PropTypes.object.isRequired,
        validatorRegistry: PropTypes.object.isRequired,
        elementValues: PropTypes.object,
        onHandleDialogEditorValueChange: PropTypes.func.isRequired,
        onHandleSave: PropTypes.func.isRequired,
        onHandleBack: PropTypes.func.isRequired
    };

    renderBackAction() {
        return (
            <Button
                key="back"
                style="lighter"
                hoverStyle="brand"
                onClick={this.props.onHandleBack}
                >
                <I18n id="TYPO3.Neos:Main:back" fallback="Back"/>
            </Button>
        );
    }

    renderSaveAction() {
        return (
            <Button
                key="save"
                style="lighter"
                hoverStyle="brand"
                onClick={this.props.onHandleSave}
                >
                <I18n id="TYPO3.Neos:Main:createNew" fallback="Create"/>
            </Button>
        );
    }

    render() {
        const {selectedNodeType, elementValues, validatorRegistry, onHandleDialogEditorValueChange} = this.props;
        const creationDialogElements = selectedNodeType.ui.creationDialog.elements;
        const validationErrors = validate(elementValues, creationDialogElements, validatorRegistry);

        return (
            <Dialog
                actions={[this.renderBackAction(), this.renderSaveAction()]}
                title={(<span><I18n fallback="Create new" id="createNew"/> <I18n id={selectedNodeType.ui.label} fallback={selectedNodeType.ui.label}/></span>)}
                onRequestClose={close}
                isOpen
                isWide
                >
                {Object.keys(creationDialogElements).map(elementName => {
                    const element = selectedNodeType.ui.creationDialog.elements[elementName];
                    const onCommit = value => onHandleDialogEditorValueChange(elementName, value);
                    const validationErrorsForElement = validationErrors[elementName];
                    return (<EditorEnvelope
                        key={elementName}
                        identifier={elementName}
                        label={$get('ui.label', element)}
                        editor={$get('ui.editor', element)}
                        options={$get('ui.editorOptions', element)}
                        commit={onCommit}
                        validationErrors={validationErrorsForElement}
                        />);
                })}
            </Dialog>
        );
    }
}
