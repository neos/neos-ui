import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $set} from 'plow-js';
import memoize from 'lodash.memoize';
import isEqual from 'lodash.isequal';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions} from '@neos-project/neos-ui-redux-store';
import validate from '@neos-project/neos-ui-validators';

import Icon from '@neos-project/react-ui-components/src/Icon/';
import Button from '@neos-project/react-ui-components/src/Button/';
import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import I18n from '@neos-project/neos-ui-i18n';
import EditorEnvelope from '@neos-project/neos-ui-editors/src/EditorEnvelope/index';

import style from './style.css';

@neos(globalRegistry => ({
    validatorRegistry: globalRegistry.get('validators')
}))
@connect(state => {
    const isOpen = $get('ui.nodeCreationDialog.isOpen', state);
    const label = $get('ui.nodeCreationDialog.label', state);
    const configuration = $get('ui.nodeCreationDialog.configuration', state);

    return {isOpen, label, configuration};
}, {
    cancel: actions.UI.NodeCreationDialog.cancel,
    back: actions.UI.NodeCreationDialog.back,
    apply: actions.UI.NodeCreationDialog.apply
})
export default class NodeCreationDialog extends PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        label: PropTypes.string,
        configuration: PropTypes.object,
        validatorRegistry: PropTypes.object.isRequired,
        cancel: PropTypes.func.isRequired,
        back: PropTypes.func.isRequired,
        apply: PropTypes.func.isRequired
    };

    defaultState = {
        values: {},
        validationErrors: null,
        isDirty: false
    };

    state = this.defaultState;

    resetState() {
        this.setState(this.defaultState);
    }

    static getDerivedStateFromProps(props, currentState) {
        const {configuration} = props;
        if (configuration && !isEqual(Object.keys(currentState.values).sort(), Object.keys(configuration.elements).sort())) {
            const defaultValues = Object.keys(configuration.elements).reduce((carry, elementName) => {
                if (configuration.elements[elementName].defaultValue === undefined) {
                    carry[elementName] = null;
                } else {
                    carry[elementName] = configuration.elements[elementName].defaultValue;
                }
                return carry;
            }, {});

            return {
                values: {
                    ...defaultValues,
                    ...currentState.values
                },
                validationErrors: currentState.validationErrors,
                isDirty: true
            };
        }
        return null;
    }

    handleDialogEditorValueChange = memoize(elementName => value => {
        const {values} = this.state;
        const newValues = Object.assign({}, values, {[elementName]: value});
        this.validateElements(newValues);
    })

    validateElements = newValues => {
        const {validatorRegistry, configuration} = this.props;
        const validationErrors = validate(newValues, configuration.elements, validatorRegistry);
        this.setState({values: newValues, isDirty: true, validationErrors});
        return validationErrors;
    }

    defineDefaultValueForElementName = elementName => {
        const {values} = this.state;
        if (!(elementName in values)) {
            const defaultValues = Object.assign(values, {[elementName]: ''});
            this.setState({values: defaultValues});
        }
    }

    replenishValuesWithDefaults = () => {
        // Fill up the values that has not been edited at the moment
        Object.keys(this.props.configuration.elements).forEach(elementName => {
            this.defineDefaultValueForElementName(elementName);
        });
    }

    handleCancel = () => {
        const {cancel} = this.props;

        cancel();
        this.resetState();
    }

    handleBack = () => {
        const {back} = this.props;

        back();
        this.resetState();
    }

    handleApply = () => {
        this.replenishValuesWithDefaults();
        const {apply} = this.props;
        const validationErrors = this.validateElements(this.state.values);
        const {isDirty, values} = this.state;
        if (!validationErrors && isDirty) {
            apply(values);
            this.resetState();
        }
    }

    handleKeyPress = event => {
        const {validationErrors, isDirty} = this.state;
        if (!validationErrors && isDirty && event.key === 'Enter') {
            this.handleApply();
        }
    }

    renderBackAction() {
        return (
            <Button
                id="neos-NodeCreationDialog-Back"
                key="back"
                style="lighter"
                hoverStyle="brand"
                onClick={this.handleBack}
                >
                <I18n id="Neos.Neos:Main:back" fallback="Back"/>
            </Button>
        );
    }

    renderTitle() {
        const {label} = this.props;

        return (
            <span>
                <I18n fallback="Create new" id="createNew"/>&nbsp;
                <I18n id={label} fallback={label}/>
            </span>
        );
    }

    renderSaveAction() {
        const {isDirty, validationErrors} = this.state;
        return (
            <Button
                id="neos-NodeCreationDialog-CreateNew"
                key="save"
                style="success"
                hoverStyle="success"
                onClick={this.handleApply}
                disabled={validationErrors && isDirty}
                >
                <Icon icon="plus-square" className={style.buttonIcon}/>
                <I18n id="Neos.Neos:Main:createNew" fallback="Create"/>
            </Button>
        );
    }

    render() {
        const {isOpen, configuration} = this.props;

        if (!isOpen) {
            return null;
        }

        const {validationErrors, isDirty} = this.state;

        return (
            <Dialog
                actions={[this.renderBackAction(), this.renderSaveAction()]}
                title={this.renderTitle()}
                onRequestClose={this.handleCancel}
                type="success"
                isOpen
                style="wide"
                id="neos-NodeCreationDialog"
                >
                <div id="neos-NodeCreationDialog-Body" className={style.body}>
                    {Object.keys(configuration.elements)
                        .filter(elementName => Boolean(configuration.elements[elementName]))
                        .map((elementName, index) => {
                            //
                            // Only display errors after user input (isDirty)
                            //
                            const validationErrorsForElement = isDirty ? $get(elementName, validationErrors) : [];
                            const element = configuration.elements[elementName];
                            const editorOptions = $set('autoFocus', index === 0, $get('ui.editorOptions', element) || {});
                            const options = Object.assign({}, editorOptions);
                            return (
                                <div key={elementName} className={style.editor}>
                                    <EditorEnvelope
                                        identifier={elementName}
                                        label={$get('ui.label', element)}
                                        editor={$get('ui.editor', element)}
                                        options={options}
                                        commit={this.handleDialogEditorValueChange(elementName)}
                                        validationErrors={validationErrorsForElement}
                                        value={this.state.values[elementName] || ''}
                                        onKeyPress={this.handleKeyPress}
                                        onEnterKey={this.handleApply}
                                        />
                                </div>
                            );
                        })
                    }
                </div>
            </Dialog>
        );
    }
}
