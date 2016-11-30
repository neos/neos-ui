import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import Bar from '@neos-project/react-ui-components/lib/Bar/';
import Grid from '@neos-project/react-ui-components/lib/Grid/';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Tabs from '@neos-project/react-ui-components/lib/Tabs/';

import {SecondaryInspector} from '@neos-project/neos-ui-inspector';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import validate from '@neos-project/neos-ui-validators/src/index';

import TabPanel from './TabPanel/index';
import style from './style.css';

@connect($transform({
    focusedNode: selectors.CR.Nodes.focusedSelector,
    transientValues: selectors.UI.Inspector.transientValues,
    node: selectors.CR.Nodes.focusedSelector
}), {
    apply: actions.UI.Inspector.apply,
    discard: actions.UI.Inspector.discard,
    commit: actions.UI.Inspector.commit
})
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    validatorRegistry: globalRegistry.get('validators')
}))
export default class Inspector extends PureComponent {
    static propTypes = {
        focusedNode: PropTypes.object,
        nodeTypesRegistry: PropTypes.object,
        validatorRegistry: PropTypes.object.isRequired,
        apply: PropTypes.func.isRequired,
        discard: PropTypes.func.isRequired,
        transientValues: PropTypes.any,

        node: PropTypes.object.isRequired,
        commit: PropTypes.func.isRequired
    };

    constructor(...args) {
        super(...args);
        this.state = {
            secondaryInspectorName: undefined,
            secondaryInspectorComponent: undefined
        };

        this.handleCloseSecondaryInspector = this.handleCloseSecondaryInspector.bind(this);
        this.renderSecondaryInspector = this.renderSecondaryInspector.bind(this);
        this.handleDiscard = this.handleDiscard.bind(this);
        this.handleApply = this.handleApply.bind(this);
    }

    renderFallback() {
        return (<div>...</div>);
    }

    handleCloseSecondaryInspector() {
        this.setState({
            secondaryInspectorName: undefined,
            secondaryInspectorComponent: undefined
        });
    }

    /**
     * API function called by nested Editors, to render a secondary inspector.
     *
     * @param string secondaryInspectorName toggle the secondary inspector if the name is the same as before.
     * @param function secondaryInspectorComponentFactory this function, when called without arguments, must return the React component to be rendered.
     */
    renderSecondaryInspector(secondaryInspectorName, secondaryInspectorComponentFactory) {
        if (this.state.secondaryInspectorName === secondaryInspectorName) {
            // we toggle the secondary inspector if it is rendered a second time; so that's why we hide it here.
            this.handleCloseSecondaryInspector();
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

    handleDiscard() {
        this.props.discard();
        this.closeSecondaryInspectorIfNeeded();
    }

    handleApply() {
        this.props.apply();
        this.closeSecondaryInspectorIfNeeded();
    }

    closeSecondaryInspectorIfNeeded() {
        if (this.state.secondaryInspectorComponent) {
            this.renderSecondaryInspector(undefined);
        }
    }

    render() {
        const {focusedNode, nodeTypesRegistry, transientValues, node, validatorRegistry, commit} = this.props;

        if (!focusedNode) {
            return this.renderFallback();
        }

        const nodeType = nodeTypesRegistry.get(node.nodeType);
        if (!nodeType.properties) {
            console.error(`No properties configured in ${node.nodeType} nodetype`);
        }
        let validationErrors = null;
        if (transientValues) {
            const transientProps = {};
            Object.keys(transientValues.toJS()).forEach(key => {
                transientProps[key] = $get([key, 'value'], transientValues);
            });
            validationErrors = validate(transientProps, nodeType.properties, validatorRegistry);
        }

        const viewConfiguration = nodeTypesRegistry.getInspectorViewConfigurationFor(focusedNode.nodeType);
        const isDiscardDisabled = transientValues === undefined;
        const isApplyDisabled = transientValues === undefined || validationErrors !== null;

        if (!viewConfiguration || !viewConfiguration.tabs) {
            return this.renderFallback();
        }

        return (
            <div className={style.inspector}>
                <Tabs
                    theme={{
                        tabs__content: style.tabs // eslint-disable-line camelcase
                    }}
                    >
                    {viewConfiguration.tabs
                        //
                        // Only display tabs, that have groups
                        //
                        .filter(t => t.groups)

                        //
                        // Render each tab as a TabPanel
                        //
                        .map(tab => {
                            return (
                                <TabPanel
                                    key={tab.id}
                                    icon={tab.icon}
                                    groups={tab.groups}
                                    renderSecondaryInspector={this.renderSecondaryInspector}
                                    validationErrors={validationErrors}
                                    node={node}
                                    commit={commit}
                                    transientValues={transientValues}
                                    />);
                        })
                    }
                </Tabs>
                <Bar position="bottom">
                    <Grid gutter="micro">
                        <Grid.Col width="half">
                            <Button style="lighter" disabled={isDiscardDisabled} onClick={this.handleDiscard} className={style.discardBtn}>
                                Discard changes
                            </Button>
                        </Grid.Col>
                        <Grid.Col width="half">
                            <Button style="lighter" disabled={isApplyDisabled} onClick={this.handleApply} className={style.publishBtn}>
                                Apply
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Bar>
                {this.state.secondaryInspectorComponent ? <SecondaryInspector onClose={this.handleCloseSecondaryInspector}>{this.state.secondaryInspectorComponent}</SecondaryInspector> : null}
            </div>
        );
    }
}
