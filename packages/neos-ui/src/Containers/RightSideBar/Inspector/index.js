import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $contains, $set} from 'plow-js';
import I18n from '@neos-project/neos-ui-i18n';
import Bar from '@neos-project/react-ui-components/src/Bar/';
import Button from '@neos-project/react-ui-components/src/Button/';
import Tabs from '@neos-project/react-ui-components/src/Tabs/';
import Immutable from 'immutable';
import debounce from 'lodash.debounce';

import {SecondaryInspector} from '@neos-project/neos-ui-inspector';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import TabPanel from './TabPanel/index';
import style from './style.css';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    validatorRegistry: globalRegistry.get('validators'),
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect((state, {nodeTypesRegistry, validatorRegistry}) => {
    const isApplyDisabledSelector = selectors.UI.Inspector.makeIsApplyDisabledSelector(nodeTypesRegistry, validatorRegistry);

    return state => {
        const isDirty = selectors.UI.Inspector.isDirty(state);
        const shouldPromptToHandleUnappliedChanges = selectors.UI.Inspector.shouldPromptToHandleUnappliedChanges(state);
        const shouldShowUnappliedChangesOverlay = isDirty && !shouldPromptToHandleUnappliedChanges;
        const shouldShowSecondaryInspector = selectors.UI.Inspector.shouldShowSecondaryInspector(state);

        return {
            focusedNode: selectors.CR.Nodes.focusedSelector(state),
            node: selectors.CR.Nodes.focusedSelector(state),
            isApplyDisabled: isApplyDisabledSelector(state),
            isDiscardDisabled: selectors.UI.Inspector.isDiscardDisabledSelector(state),
            shouldShowUnappliedChangesOverlay,
            shouldShowSecondaryInspector
        };
    };
}, {
    apply: actions.UI.Inspector.apply,
    discard: actions.UI.Inspector.discard,
    escape: actions.UI.Inspector.escape,
    commit: actions.UI.Inspector.commit,
    openSecondaryInspector: actions.UI.Inspector.openSecondaryInspector,
    closeSecondaryInspector: actions.UI.Inspector.closeSecondaryInspector
})
export default class Inspector extends PureComponent {
    static propTypes = {
        nodeTypesRegistry: PropTypes.object,
        i18nRegistry: PropTypes.object.isRequired,

        focusedNode: PropTypes.object,
        node: PropTypes.object.isRequired,
        isApplyDisabled: PropTypes.bool,
        isDiscardDisabled: PropTypes.bool,
        shouldShowUnappliedChangesOverlay: PropTypes.bool,
        shouldShowSecondaryInspector: PropTypes.bool,

        apply: PropTypes.func.isRequired,
        discard: PropTypes.func.isRequired,
        escape: PropTypes.func.isRequired,
        commit: PropTypes.func.isRequired,
        openSecondaryInspector: PropTypes.func.isRequired,
        closeSecondaryInspector: PropTypes.func.isRequired
    };

    state = {
        secondaryInspectorComponent: null
    };

    constructor(props) {
        super(props);
        this.cloneViewConfiguration(props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.focusedNode !== this.props.focusedNode) {
            this.cloneViewConfiguration(newProps);
        }
        if (!newProps.shouldShowSecondaryInspector) {
            this.setState({
                secondaryInspectorName: undefined,
                secondaryInspectorComponent: undefined
            });
        }
    }

    componentWillUnmount() {
        // Abort any debounced calls
        this.preprocessViewConfigurationDebounced.cancel();
    }

    //
    // Fetch viewConfiguration and clone it once the focusedNode changes
    //
    cloneViewConfiguration = props => {
        this.viewConfiguration = Immutable.fromJS(props.nodeTypesRegistry.getInspectorViewConfigurationFor($get('nodeType', props.focusedNode)));
        this.originalViewConfiguration = this.viewConfiguration;
    };

    //
    // Update viewConfiguration, while keeping originalViewConfiguration to read original property values from it
    //
    preprocessViewConfiguration = (context = {}, path = []) => {
        const currentLevel = path.length === 0 ? this.viewConfiguration : $get(path, this.viewConfiguration);
        currentLevel.forEach((propertyValue, propertyName) => {
            const newPath = path.slice();
            newPath.push(propertyName);
            const originalPropertyValue = $get(newPath, this.originalViewConfiguration);

            if (propertyValue !== null && typeof propertyValue === 'object') {
                this.preprocessViewConfiguration(context, newPath);
            } else if (typeof originalPropertyValue === 'string' && originalPropertyValue.indexOf('ClientEval:') === 0) {
                const {node} = context; // eslint-disable-line
                const evaluatedValue = eval(originalPropertyValue.replace('ClientEval:', '')); // eslint-disable-line
                if (evaluatedValue !== propertyValue) {
                    this.viewConfiguration = $set(newPath, evaluatedValue, this.viewConfiguration);
                }
            }
        });
    };

    preprocessViewConfigurationDebounced = debounce(() => {
        // Calculate node property values for context
        const nodeForContext = focusedNode.toJS();
            transientValues.map(item => item.value).toJS();
            nodeForContext.properties = Object.assign({}, nodeForContext.properties, transientValues.map(item => $get('value', item)).toJS());
        }

        // Eval the view configuration
        this.preprocessViewConfiguration({node: nodeForContext});
        // Force re-render, since we were debounced
        this.setState({});
    }, 250);

    handleCloseSecondaryInspector = () => {
        this.props.closeSecondaryInspector();
    }

    handleDiscard = () => {
        this.props.discard();
        this.closeSecondaryInspectorIfNeeded();
    }

    handleApply = () => {
        this.props.apply();
        this.closeSecondaryInspectorIfNeeded();
    }

    handleEscape = () => {
        this.props.escape();
    }

    closeSecondaryInspectorIfNeeded = () => {
        if (this.state.secondaryInspectorComponent) {
            this.props.closeSecondaryInspector();
        }
    }

    isPropertyEnabled = ({id}) => {
        const {focusedNode} = this.props;

        return !$contains(id, 'policy.disallowedProperties', focusedNode);
    };

    /**
     * API function called by nested Editors, to render a secondary inspector.
     *
     * @param string secondaryInspectorName toggle the secondary inspector if the name is the same as before.
     * @param function secondaryInspectorComponentFactory this function, when called without arguments, must return the React component to be rendered.
     */
    renderSecondaryInspector = (secondaryInspectorName, secondaryInspectorComponentFactory) => {
        if (this.state.secondaryInspectorName === secondaryInspectorName) {
            // we toggle the secondary inspector if it is rendered a second time; so that's why we hide it here.
            this.handleCloseSecondaryInspector();
        } else {
            let secondaryInspectorComponent = null;
            if (secondaryInspectorComponentFactory) {
                // Hint: we directly resolve the factory function here, to ensure the object is not re-created on every render but stays the same for its whole lifetime.
                secondaryInspectorComponent = secondaryInspectorComponentFactory();
                this.props.openSecondaryInspector();
            }
            this.setState({
                secondaryInspectorName,
                secondaryInspectorComponent
            });
        }
    }

    renderFallback() {
        return (<div>...</div>);
    }

    render() {
        const {
            focusedNode,
            node,
            commit,
            isApplyDisabled,
            isDiscardDisabled,
            shouldShowUnappliedChangesOverlay,
            shouldShowSecondaryInspector,
            i18nRegistry
        } = this.props;

        if (!focusedNode) {
            return this.renderFallback();
        }

        this.preprocessViewConfigurationDebounced();
        const viewConfiguration = this.viewConfiguration;

        if (!$get('tabs', viewConfiguration)) {
            return this.renderFallback();
        }

        return (
            <div className={style.inspector}>
                {shouldShowUnappliedChangesOverlay &&
                    <div
                        role="button"
                        className={style.unappliedChangesOverlay}
                        onClick={this.handleEscape}
                        />
                }
                <Tabs
                    theme={{
                        tabs__content: style.tabs // eslint-disable-line camelcase
                    }}
                    >
                    {$get('tabs', viewConfiguration)
                        //
                        // Only display tabs, that have groups and these groups have properties
                        //
                        .filter(t => $get('groups', t) && $get('groups', t).count() > 0 && $get('groups', t).reduce((acc, group) => (
                            acc ||
                            $get('properties', group).filter(this.isPropertyEnabled).count() > 0 ||
                            $get('views', group).count() > 0
                        ), false))

                        //
                        // Render each tab as a TabPanel
                        //
                        .map(tab => {
                            return (
                                <TabPanel
                                    key={$get('id', tab)}
                                    icon={$get('icon', tab)}
                                    groups={$get('groups', tab)}
                                    tooltip={i18nRegistry.translate($get('label', tab))}
                                    renderSecondaryInspector={this.renderSecondaryInspector}
                                    node={node}
                                    commit={commit}
                                    />);
                        })
                    }
                </Tabs>
                <Bar position="bottom" className={style.actions}>
                    <Button style="lighter" disabled={isDiscardDisabled} onClick={this.handleDiscard} className={`${style.button} ${style.discardButton}`}>
                        <I18n id="Neos.Neos:Main:discard" fallback="discard"/>
                    </Button>
                    <Button style="lighter" disabled={isApplyDisabled} onClick={this.handleApply} className={`${style.button} ${style.publishButton}`}>
                        <I18n id="Neos.Neos:Main:apply" fallback="apply"/>
                    </Button>
                </Bar>
                {
                    shouldShowSecondaryInspector &&
                    this.state.secondaryInspectorComponent &&
                    <SecondaryInspector
                        onClose={this.handleCloseSecondaryInspector}
                        >
                            {this.state.secondaryInspectorComponent}
                    </SecondaryInspector>
                }
            </div>
        );
    }
}
