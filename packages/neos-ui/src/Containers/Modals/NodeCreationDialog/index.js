import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $set} from 'plow-js';
import memoize from 'lodash.memoize';
import cx from 'classnames';
import {produce} from 'immer';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions} from '@neos-project/neos-ui-redux-store';
import validate from '@neos-project/neos-ui-validators';

import Icon from '@neos-project/react-ui-components/src/Icon/';
import Button from '@neos-project/react-ui-components/src/Button/';
import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import I18n from '@neos-project/neos-ui-i18n';
import EditorEnvelope from '@neos-project/neos-ui-editors/src/EditorEnvelope/index';

import style from './style.css';

const defaultState = {
    transient: {},
    viewConfiguration: {},
    node: {properties: {}},
    validationErrors: null,
    isDirty: false,
    secondaryInspectorName: '',
    secondaryInspectorComponent: null
};

const getTransientDefaultValuesFromConfiguration = (configuration, state) => {
    if (configuration) {
        return Object.keys(configuration.elements).reduce(
            (transientDefaultValues, elementName) => {
                if (configuration.elements[elementName].defaultValue === undefined) {
                    transientDefaultValues[elementName] = {value: null};
                    state.node.properties[elementName] = '';
                } else {
                    transientDefaultValues[elementName] = {
                        value: configuration.elements[elementName].defaultValue
                    };
                    state.node.properties[elementName] = configuration.elements[elementName].defaultValue;
                }
                return transientDefaultValues;
            },
            {}
        );
    }
    return {};
}

const getDerivedStateFromProps = (props, state) => {
    if (!props.isOpen) {
        return defaultState;
    }

    if (state.isDirty) {
        return state;
    }

    const transientDefaultValues = getTransientDefaultValuesFromConfiguration(
        props.configuration,
        state
    );

    return {
        ...state,
        transient: {
            ...transientDefaultValues,
            ...state.transient
        }
    };
}

const preprocessViewConfiguration = (state, path = [], viewConfiguration, originalViewConfiguration) => {
    const currentLevel = path.length === 0 ? viewConfiguration : $get(path, viewConfiguration);
    Object.keys(currentLevel).forEach(propertyName => {
        const propertyValue = currentLevel[propertyName];
        const newPath = path.slice();
        newPath.push(propertyName);
        const originalPropertyValue = $get(newPath, originalViewConfiguration);

        if (propertyValue !== null && typeof propertyValue === 'object') {
            viewConfiguration = preprocessViewConfiguration(state, newPath, viewConfiguration, originalViewConfiguration);
        } else if (typeof originalPropertyValue === 'string' && originalPropertyValue.indexOf('ClientEval:') === 0) {
            const {node, transient} = state; // eslint-disable-line
            try {
                // eslint-disable-next-line no-new-func
                const evaluatedValue = new Function('node', 'return ' + originalPropertyValue.replace('ClientEval:', ''))(node);
                if (evaluatedValue !== propertyValue) {
                    viewConfiguration = produce(
                        viewConfiguration,
                        draft => {
                            return $set(newPath, evaluatedValue, draft);
                        }
                    );
                    // if (viewConfiguration.elements[newPath[1]].ui.hidden) {
                    //     transient[newPath[1]].value = '';
                    // }
                }
            } catch (e) {
                console.warn('An error occurred while trying to evaluate "' + originalPropertyValue + '"\n', e);
            }
        }
    });
    return viewConfiguration;
};

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

    static defaultState = {
        transient: {},
        validationErrors: null,
        isDirty: false,
        secondaryInspectorName: '',
        secondaryInspectorComponent: null
    };

    constructor(props) {
        super(props);
        this.state = getDerivedStateFromProps(props, defaultState);
    }

    static getDerivedStateFromProps(props, state) {
        return getDerivedStateFromProps(props, state);
    }

    handleDialogEditorValueChange = memoize(elementName => (value, hooks) => {
        const transient = $set(elementName, {value, hooks}, this.state.transient);
        const validationErrors = this.getValidationErrorsForTransientValues(transient);
        const node = $set(`properties.${elementName}`, value, this.state.node);

        this.setState({
            transient,
            node,
            isDirty: true,
            validationErrors
        });
    })

    getValidationErrorsForTransientValues = transientValues => {
        const {validatorRegistry, configuration} = this.props;
        const values = this.getValuesMapFromTransientValues(transientValues);

        return validate(values, configuration.elements, validatorRegistry);
    }

    getValuesMapFromTransientValues = transientValues => {
        return Object.keys(transientValues).reduce(
            (valuesMap, elementName) => {
                valuesMap[elementName] = transientValues[elementName].value;
                return valuesMap;
            },
            {}
        );
    }

    handleCancel = () => {
        const {cancel} = this.props;
        cancel();
    }

    handleBack = () => {
        const {back} = this.props;
        back();
    }

    handleApply = () => {
        const {transient} = this.state;
        const validationErrors = this.getValidationErrorsForTransientValues(transient);

        if (validationErrors) {
            this.setState({validationErrors, isDirty: true});
        } else {
            const {apply} = this.props;
            apply(transient);
            this.setState(defaultState);
        }
    }

    handleKeyPress = event => {
        if (event.key === 'Enter') {
            this.handleApply();
        }
    }

    handleSecondaryInspectorDismissal = () => this.setState({
        secondaryInspectorName: '',
        secondaryInspectorComponent: null
    });

    /**
     * API function called by nested Editors, to render a secondary inspector.
     *
     * @param string secondaryInspectorName toggle the secondary inspector if the name is the same as before.
     * @param function secondaryInspectorComponentFactory this function, when called without arguments, must return the React component to be rendered.
     */
    renderSecondaryInspector = (secondaryInspectorName, secondaryInspectorComponentFactory) => {
        if (this.state.secondaryInspectorName === secondaryInspectorName) {
            // We toggle the secondary inspector if it is rendered a second time; so that's why we hide it here.
            // @TODO: this.handleCloseSecondaryInspector();
        } else {
            let secondaryInspectorComponent = null;
            if (secondaryInspectorComponentFactory) {
                // Hint: we directly resolve the factory function here, to ensure the object is not re-created on every render but stays the same for its whole lifetime.
                secondaryInspectorComponent = secondaryInspectorComponentFactory();
            }

            this.setState({
                secondaryInspectorName,
                secondaryInspectorComponent
            });
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

    renderElement(elementName, isFirst) {
        const {viewConfiguration} = this.state;
        const {validationErrors, isDirty} = this.state;
        const validationErrorsForElement = isDirty ? $get(elementName, validationErrors) : [];
        const element = viewConfiguration.elements[elementName];
        const options = $set('autoFocus', isFirst, Object.assign({}, $get('ui.editorOptions', element)));

        return (
            <div key={elementName} className={style.editor}>
                <EditorEnvelope
                    identifier={`${elementName}--creation-dialog`}
                    label={$get('ui.label', element)}
                    editor={$get('ui.editor', element)}
                    helpMessage={$get('ui.help.message', element) || ''}
                    helpThumbnail={$get('ui.help.thumbnail', element) || ''}
                    options={options}
                    commit={this.handleDialogEditorValueChange(elementName)}
                    validationErrors={validationErrorsForElement}
                    value={this.state.transient[elementName].value || ''}
                    hooks={this.state.transient[elementName].hooks}
                    onKeyPress={this.handleKeyPress}
                    onEnterKey={this.handleApply}
                    renderSecondaryInspector={this.renderSecondaryInspector}
                />
            </div>
        );
    }

    renderAllElements() {
        const {viewConfiguration} = this.state;

        return Object.keys(viewConfiguration.elements).reduce(
            (result, elementName, index) => {
                if (viewConfiguration.elements[elementName] && !viewConfiguration.elements[elementName].ui.hidden) {
                    result.push(
                        this.renderElement(elementName, index === 0)
                    );
                }

                return result;
            },
            []
        );
    }

    render() {
        const {isOpen} = this.props;

        if (!isOpen) {
            return null;
        }

        this.state.viewConfiguration = preprocessViewConfiguration(
            this.state,
            [],
            this.props.configuration,
            this.props.configuration
        );

        return (
            <Dialog
                actions={[this.renderBackAction(), this.renderSaveAction()]}
                title={this.renderTitle()}
                onRequestClose={this.handleCancel}
                type="success"
                isOpen
                style={this.state.secondaryInspectorComponent ? 'jumbo' : 'wide'}
                id="neos-NodeCreationDialog"
                >
                <div
                    id="neos-NodeCreationDialog-Body"
                    className={cx({
                        [style.body]: true,
                        [style.expanded]: Boolean(this.state.secondaryInspectorComponent)
                    })}
                    >
                    <div className={style.secondaryColumn}>
                        <div className={style.secondaryColumn__contentWrapper}>
                            <Button
                                style="clean"
                                className={style.close}
                                onClick={this.handleSecondaryInspectorDismissal}
                            >
                                <Icon icon="chevron-left" />
                            </Button>

                            {this.state.secondaryInspectorComponent}
                        </div>
                    </div>
                    <div className={style.primaryColumn}>
                        {this.renderAllElements()}
                    </div>
                </div>
            </Dialog>
        );
    }
}
