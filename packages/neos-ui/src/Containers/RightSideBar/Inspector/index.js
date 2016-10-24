import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';
import Bar from '@neos-project/react-ui-components/lib/Bar/';
import Grid from '@neos-project/react-ui-components/lib/Grid/';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Tabs from '@neos-project/react-ui-components/lib/Tabs/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import TabPanel from './TabPanel/index';
import style from './style.css';

@connect($transform({
    focusedNode: selectors.CR.Nodes.focusedSelector,
    transientValues: selectors.UI.Inspector.transientValues
}), {
    apply: actions.UI.Inspector.apply,
    discard: actions.UI.Inspector.discard
})
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class Inspector extends Component {
    static propTypes = {
        focusedNode: PropTypes.object,
        nodeTypesRegistry: PropTypes.object,
        apply: PropTypes.func.isRequired,
        discard: PropTypes.func.isRequired,
        transientValues: PropTypes.any
    };

    renderFallback() {
        return (<div>...</div>);
    }

    render() {
        const {focusedNode, nodeTypesRegistry, apply, discard, transientValues} = this.props;

        if (!focusedNode) {
            return this.renderFallback();
        }

        const viewConfiguration = nodeTypesRegistry.getInspectorViewConfigurationFor(focusedNode.nodeType);
        const isDisabled = transientValues === undefined;

        if (!viewConfiguration || !viewConfiguration.tabs) {
            return this.renderFallback();
        }

        return (
            <div className={style.inspector}>
                <Tabs>
                    {viewConfiguration.tabs
                        //
                        // Only display tabs, that have groups
                        //
                        .filter(t => t.groups)

                        //
                        // Render each tab as a TabPanel
                        //
                        .map(tab => <TabPanel key={tab.id} icon={tab.icon} groups={tab.groups}/>)
                    }
                </Tabs>
                <Bar position="bottom">
                    <Grid gutter="micro">
                        <Grid.Col width="half">
                            <Button style="lighter" disabled={isDisabled} onClick={discard} className={style.discardBtn}>
                                Discard changes
                            </Button>
                        </Grid.Col>
                        <Grid.Col width="half">
                            <Button style="lighter" disabled={isDisabled} onClick={apply} className={style.publishBtn}>
                                Apply
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Bar>
            </div>
        );
    }
}
