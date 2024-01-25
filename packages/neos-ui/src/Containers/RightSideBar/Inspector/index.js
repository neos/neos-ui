import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {produce} from 'immer';
import mapValues from 'lodash.mapvalues';
import {connect} from 'react-redux';

import I18n from '@neos-project/neos-ui-i18n';
import {Bar, Button, Tabs, Icon, Badge} from '@neos-project/react-ui-components';
import debounce from 'lodash.debounce';

import {SecondaryInspector} from '@neos-project/neos-ui-inspector';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import preprocessNodeConfiguration from '../../../preprocessNodeConfiguration';

import SelectedElement from './SelectedElement/index';
import TabPanel from './TabPanel/index';
import style from './style.module.css';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    validatorRegistry: globalRegistry.get('validators'),
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect((state, {nodeTypesRegistry, validatorRegistry}) => {
    const validationErrorsSelector = selectors.UI.Inspector.makeValidationErrorsSelector(nodeTypesRegistry, validatorRegistry);
    const isApplyDisabledSelector = selectors.UI.Inspector.makeIsApplyDisabledSelector(nodeTypesRegistry, validatorRegistry);

    return state => {
        const isDirty = selectors.UI.Inspector.isDirty(state);
        const shouldPromptToHandleUnappliedChanges = selectors.UI.Inspector.shouldPromptToHandleUnappliedChanges(state);
        const shouldShowUnappliedChangesOverlay = isDirty && !shouldPromptToHandleUnappliedChanges;
        const shouldShowSecondaryInspector = selectors.UI.Inspector.shouldShowSecondaryInspector(state);
        const focusedNode = selectors.CR.Nodes.focusedSelector(state);
        const parentNode = focusedNode ? selectors.CR.Nodes.nodeByContextPath(state)(focusedNode.parent) : null;

        return {
            focusedNode,
            focusedContentNodesContextPaths: selectors.CR.Nodes.focusedNodePathsSelector(state),
            focusedDocumentNodesContextPaths: selectors.UI.PageTree.getAllFocused(state),
            parentNode,
            validationErrors: validationErrorsSelector(state),
            isApplyDisabled: isApplyDisabledSelector(state),
            transientValues: selectors.UI.Inspector.transientValues(state),
            isDiscardDisabled: selectors.UI.Inspector.isDiscardDisabledSelector(state),
            shouldShowUnappliedChangesOverlay,
            shouldShowSecondaryInspector,
            isWorkspaceReadOnly: selectors.CR.Workspaces.isWorkspaceReadOnlySelector(state)
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
        isApplyDisabled: PropTypes.bool,
        isDiscardDisabled: PropTypes.bool,
        shouldShowUnappliedChangesOverlay: PropTypes.bool,
        shouldShowSecondaryInspector: PropTypes.bool,
        transientValues: PropTypes.object,
        isWorkspaceReadOnly: PropTypes.bool,

        apply: PropTypes.func.isRequired,
        discard: PropTypes.func.isRequired,
        escape: PropTypes.func.isRequired,
        commit: PropTypes.func.isRequired,
        openSecondaryInspector: PropTypes.func.isRequired,
        closeSecondaryInspector: PropTypes.func.isRequired
    };

    state = {
        secondaryInspectorComponent: null,
        toggledPanels: {},
        viewConfiguration: null,
        originalViewConfiguration: null
    };

    configurationIsProcessed = false;

    constructor(props) {
        super(props);

        if (props.focusedNode) {
            const originalViewConfiguration = props.nodeTypesRegistry.getInspectorViewConfigurationFor(props.focusedNode?.nodeType);

            const nodeForContext = this.generateNodeForContext(
                this.props.focusedNode,
                this.props.transientValues
            );
            const processedViewConfiguration = preprocessNodeConfiguration(
                {node: nodeForContext, parentNode: this.props.parentNode}, originalViewConfiguration
            );

            this.state.viewConfiguration = processedViewConfiguration || originalViewConfiguration;
            this.state.originalViewConfiguration = originalViewConfiguration;
        }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.focusedNode !== this.props.focusedNode) {
            this.setState({
                viewConfiguration: newProps.nodeTypesRegistry.getInspectorViewConfigurationFor(newProps.focusedNode?.nodeType),
                originalViewConfiguration: newProps.nodeTypesRegistry.getInspectorViewConfigurationFor(newProps.focusedNode?.nodeType)
            });
        }
        if (!newProps.shouldShowSecondaryInspector) {
            this.setState({
                secondaryInspectorName: undefined,
                secondaryInspectorComponent: undefined
            });
        }
    }

    componentDidUpdate() {
        this.preprocessViewConfigurationDebounced();
    }

    componentWillUnmount() {
        // Abort any debounced calls
        this.preprocessViewConfigurationDebounced.cancel();
    }

    evaluateExpression = expression => {
        try {
            // eslint-disable-next-line no-new-func
            const fn = new Function(
                'node,parentNode',
                'return ' + expression.replace('ClientEval:', '')
            );
            const nodeForContext = this.generateNodeForContext(
                this.props.focusedNode,
                this.props.transientValues
            );

            return fn(nodeForContext, this.props.parentNode);
        } catch (e) {
            console.warn('An error occurred while trying to evaluate "' + expression + '"\n', e);
            return null;
        }
    }

    //
    // Return updated viewConfiguration, while keeping originalViewConfiguration to read original property values from it
    //
    preprocessViewConfiguration = value => {
        if (value?.constructor === Object) { // value is plain object
            return Object.fromEntries(
                Object.entries(value).map(
                    ([key, value]) => [
                        key,
                        this.preprocessViewConfiguration(value)
                    ])
            );
        }

        if (Array.isArray(value)) {
            return value.map(this.preprocessViewConfiguration);
        }

        if (typeof value === 'string') {
            const nextValue = value.startsWith('ClientEval:') ? this.evaluateExpression(value) : value;

            if (nextValue !== value) {
                this.configurationIsProcessed = true;
            }

            return nextValue;
        }

        return value;
    };

    preprocessViewConfigurationDebounced = debounce(() => {
        const {originalViewConfiguration} = this.state;

        // Original View Configuration may be null, if there's no focused node
        if (!originalViewConfiguration) {
            return;
        }

        this.configurationIsProcessed = false;
        const nodeForContext = this.generateNodeForContext(
            this.props.focusedNode,
            this.props.transientValues
        );
        const processedViewConfiguration = preprocessNodeConfiguration(
            {node: nodeForContext, parentNode: this.props.parentNode},
            originalViewConfiguration
        );

        if (processedViewConfiguration !== this.state.viewConfiguration) {
            this.setState({
                viewConfiguration: processedViewConfiguration
            });
        }
    }, 250, {leading: true});

    generateNodeForContext(focusedNode, transientValues) {
        if (transientValues) {
            return produce(focusedNode, draft => {
                const mappedTransientValues = mapValues(transientValues, item => item?.value);
                draft.properties = Object.assign({}, draft.properties, mappedTransientValues);
            });
        }

        return focusedNode;
    }

    handleCloseSecondaryInspector = () => {
        this.props.closeSecondaryInspector();
    }

    handleDiscard = () => {
        this.props.discard(this.props.focusedNode.contextPath);
        this.closeSecondaryInspectorIfNeeded();
    }

    handleApply = () => {
        if (!this.props.isApplyDisabled && !this.props.isWorkspaceReadOnly) {
            this.props.apply();
            this.closeSecondaryInspectorIfNeeded();
        }
    }

    handleEscape = () => {
        this.props.escape();
    }

    closeSecondaryInspectorIfNeeded = () => {
        if (this.state.secondaryInspectorComponent) {
            this.props.closeSecondaryInspector();
        }
    }

    isPropertyEnabled = item => {
        const {focusedNode} = this.props;

        if (item.type !== 'editor') {
            return true;
        }

        if (item?.hidden || (focusedNode?.isAutoCreated === true && item?.id === '_hidden')) {
            // This accounts for the fact that auto-created child nodes cannot
            // be hidden via the insprector (see: #2282)
            return false;
        }

        return focusedNode?.policy?.canEdit && !focusedNode?.policy?.disallowedProperties?.includes(item?.id);
    };

    /**
     * API function called by nested Editors, to render a secondary inspector.
     *
     * @param string secondaryInspectorName toggle the secondary inspector if the name is the same as before.
     * @param function secondaryInspectorComponentFactory this function, when called without arguments, must return the React component to be rendered.
     */
    renderSecondaryInspector = (secondaryInspectorName, secondaryInspectorComponentFactory) => {
        if (this.state.secondaryInspectorName === secondaryInspectorName) {
            // We toggle the secondary inspector if it is rendered a second time; so that's why we hide it here.
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
        return (<div className={style.centeredInspector}><div><Icon icon="spinner" spin={true} size="lg" /></div></div>);
    }

    handlePanelToggle = (tabName, groupName) => this.setState(state => {
        const isPanelOpen = state.toggledPanels?.[tabName]?.[groupName] ?? false;

        return {
            toggledPanels: {
                ...state?.toggledPanels,
                [tabName]: {
                    ...state.toggledPanels?.[tabName],
                    [groupName]: !isPanelOpen
                }
            }
        };
    });

    getAmountOfValidationErrors = (tab, validationErrors) => {
        let errors = 0;
        tab.groups.forEach(group => {
            group.items.forEach(item => {
                if (Object.keys(validationErrors).includes(item.id)) {
                    errors += 1;
                }
            });
        });

        return errors;
    };

    render() {
        const {
            focusedNode,
            focusedContentNodesContextPaths,
            focusedDocumentNodesContextPaths,
            commit,
            validationErrors,
            isApplyDisabled,
            isDiscardDisabled,
            shouldShowUnappliedChangesOverlay,
            shouldShowSecondaryInspector,
            i18nRegistry,
            isWorkspaceReadOnly
        } = this.props;
        if (focusedContentNodesContextPaths.length > 1) {
            return (
                <div
                    title={i18nRegistry.translate('inspectorMutlipleContentNodesSelectedTooltip', 'Select a single document in order to be able to edit its properties', {}, 'Neos.Neos.Ui', 'Main')}
                    className={style.centeredInspector}
                    >
                    <div>{focusedContentNodesContextPaths.length} {i18nRegistry.translate('contentElementsSelected', 'content elements selected', {}, 'Neos.Neos.Ui', 'Main')}</div>
                </div>
            );
        }
        if (focusedDocumentNodesContextPaths.length > 1) {
            return (
                <div
                    title={i18nRegistry.translate('inspectorMutlipleDocumentNodesSelectedTooltip', 'Select a single content element in order to be able to edit its properties', {}, 'Neos.Neos.Ui', 'Main')}
                    className={style.centeredInspector}
                    >
                    <div>{focusedDocumentNodesContextPaths.length} {i18nRegistry.translate('documentsSelected', 'documents selected', {}, 'Neos.Neos.Ui', 'Main')}</div>
                </div>
            );
        }

        const augmentedCommit = (propertyId, value, hooks) => {
            commit(propertyId, value, hooks, focusedNode);
        };

        if (!focusedNode) {
            return null;
        }
        if (!focusedNode?.isFullyLoaded) {
            return this.renderFallback();
        }

        if (!this.state.viewConfiguration?.tabs) {
            return this.renderFallback();
        }

        return (
            <div id="neos-Inspector" className={style.inspector}>
                {shouldShowUnappliedChangesOverlay && ReactDOM.createPortal(
                    <div
                        role="button"
                        className={style.unappliedChangesOverlay}
                        onClick={this.handleEscape}
                        />,
                    document.body
                )}
                <SelectedElement/>
                <Tabs
                    className={style.tabs}
                    theme={{
                        tabs__content: style.tabsContent // eslint-disable-line camelcase
                    }}
                    >
                    {this.state.viewConfiguration?.tabs
                        //
                        // Only display tabs, that have groups and these groups have properties
                        //
                        .filter(tab => tab?.groups?.some(group => (
                            group?.items?.some(this.isPropertyEnabled)
                        )))

                        //
                        // Render each tab as a TabPanel
                        //
                        .map(tab => {
                            const notifications = validationErrors ?
                                this.getAmountOfValidationErrors(tab, validationErrors) : 0;
                            const tabLabel = i18nRegistry.translate(tab?.label);
                            const notificationTooltipLabelPieces = i18nRegistry.translate(
                                'UI.RightSideBar.tabs.validationErrorTooltip',
                                '',
                                {
                                    tabName: tabLabel,
                                    amountOfErrors: notifications
                                },
                                'Neos.Neos.Ui',
                                'Main',
                                notifications
                            );
                            // @todo remove that when substitutePlaceholders of I18nRegistry returns strings
                            const notificationTooltipLabel = Array.isArray(notificationTooltipLabelPieces) ?
                                notificationTooltipLabelPieces.join('') : notificationTooltipLabelPieces;

                            return (
                                <TabPanel
                                    key={tab?.id}
                                    id={tab?.id}
                                    icon={tab?.icon}
                                    groups={tab?.groups}
                                    notifications={notifications}
                                    title={Boolean(notifications) && <Badge className={style.tabs__notificationBadge} label={String(notifications)}/>}
                                    toggledPanels={this.state.toggledPanels?.[tab?.id]}
                                    tooltip={notifications ? notificationTooltipLabel : tabLabel}
                                    renderSecondaryInspector={this.renderSecondaryInspector}
                                    node={focusedNode}
                                    commit={augmentedCommit}
                                    handlePanelToggle={([groupName]) => {
                                        this.handlePanelToggle(tab?.id, groupName);
                                    }}
                                    handleInspectorApply={this.handleApply}
                            />);
                        })
                    }
                </Tabs>
                <Bar position="bottom" className={style.actions}>
                    <Button id="neos-Inspector-Discard" style="lighter" disabled={isDiscardDisabled} onClick={this.handleDiscard} className={`${style.button} ${style.discardButton}`}>
                        <I18n id="Neos.Neos:Main:discard" fallback="discard"/>
                    </Button>
                    <Button id="neos-Inspector-Apply" style="lighter" disabled={isApplyDisabled || isWorkspaceReadOnly} onClick={this.handleApply} className={`${style.button} ${style.publishButton}`}>
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
