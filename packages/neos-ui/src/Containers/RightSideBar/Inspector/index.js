import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import I18n from '@neos-project/neos-ui-i18n';
import Bar from '@neos-project/react-ui-components/src/Bar/';
import Grid from '@neos-project/react-ui-components/src/Grid/';
import Button from '@neos-project/react-ui-components/src/Button/';
import Tabs from '@neos-project/react-ui-components/src/Tabs/';

import {SecondaryInspector} from '@neos-project/neos-ui-inspector';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import TabPanel from './TabPanel/index';
import style from './style.css';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    validatorRegistry: globalRegistry.get('validators')
}))
@connect((state, {nodeTypesRegistry, validatorRegistry}) => {
    const isApplyDisabledSelector = selectors.UI.Inspector.makeIsApplyDisabledSelector(nodeTypesRegistry, validatorRegistry);

    return state => ({
        focusedNode: selectors.CR.Nodes.focusedSelector(state),
        node: selectors.CR.Nodes.focusedSelector(state),
        isApplyDisabled: isApplyDisabledSelector(state),
        isDiscardDisabled: selectors.UI.Inspector.isDiscardDisabledSelector(state)
    });
}, {
    apply: actions.UI.Inspector.apply,
    discard: actions.UI.Inspector.discard,
    commit: actions.UI.Inspector.commit
})
export default class Inspector extends PureComponent {
    static propTypes = {
        nodeTypesRegistry: PropTypes.object,

        focusedNode: PropTypes.object,
        node: PropTypes.object.isRequired,
        isApplyDisabled: PropTypes.bool,
        isDiscardDisabled: PropTypes.bool,

        apply: PropTypes.func.isRequired,
        discard: PropTypes.func.isRequired,
        commit: PropTypes.func.isRequired
    };

    state = {
        secondaryInspectorComponent: null
    };

    handleCloseSecondaryInspector = () => {
        this.setState({
            secondaryInspectorName: undefined,
            secondaryInspectorComponent: undefined
        });
    }

    handleDiscard = () => {
        this.props.discard();
        this.closeSecondaryInspectorIfNeeded();
    }

    handleApply = () => {
        this.props.apply();
        this.closeSecondaryInspectorIfNeeded();
    }

    closeSecondaryInspectorIfNeeded = () => {
        if (this.state.secondaryInspectorComponent) {
            this.renderSecondaryInspector(undefined);
        }
    }

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
        const {focusedNode, nodeTypesRegistry, node, commit, isApplyDisabled, isDiscardDisabled} = this.props;

        if (!focusedNode) {
            return this.renderFallback();
        }

        const viewConfiguration = nodeTypesRegistry.getInspectorViewConfigurationFor($get('nodeType', focusedNode));

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
                        // Only display tabs, that have groups and these groups have properties
                        //
                        .filter(t => t.groups && t.groups.length && t.groups.reduce((acc, group) => {
                            return acc || group.properties.length > 0;
                        }, false))

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
                                    node={node}
                                    commit={commit}
                                    />);
                        })
                    }
                </Tabs>
                <Bar position="bottom">
                    <Grid gutter="micro">
                        <Grid.Col width="half">
                            <Button style="lighter" disabled={isDiscardDisabled} onClick={this.handleDiscard} className={style.discardBtn}>
                                <I18n id="discard"/>
                            </Button>
                        </Grid.Col>
                        <Grid.Col width="half">
                            <Button style="lighter" disabled={isApplyDisabled} onClick={this.handleApply} className={style.publishBtn}>
                                <I18n id="apply"/>
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Bar>
                {this.state.secondaryInspectorComponent ? <SecondaryInspector onClose={this.handleCloseSecondaryInspector}>{this.state.secondaryInspectorComponent}</SecondaryInspector> : null}
            </div>
        );
    }
}
