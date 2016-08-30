import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';
import Bar from '@neos-project/react-ui-components/lib/Bar/';
import Grid from '@neos-project/react-ui-components/lib/Grid/';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Tabs from '@neos-project/react-ui-components/lib/Tabs/';

import {actions, selectors} from 'Host/Redux/index';

import TabPanel from './TabPanel/index';
import style from './style.css';

@connect($transform({
    viewConfiguration: selectors.UI.Inspector.viewConfiguration,
    transientValues: selectors.UI.Inspector.transientValues
}), {
    apply: actions.UI.Inspector.apply,
    discard: actions.UI.Inspector.discard
})
export default class Inspector extends Component {
    static propTypes = {
        viewConfiguration: PropTypes.shape({
            tabs: PropTypes.array
        }),
        apply: PropTypes.func.isRequired,
        discard: PropTypes.func.isRequired,
        transientValues: PropTypes.any
    };

    render() {
        const {viewConfiguration, apply, discard, transientValues} = this.props;
        const {tabs} = viewConfiguration;

        const isDisabled = transientValues === undefined;

        const inspector = tabs => (
            <div className={style.inspector}>
                <Tabs>
                    {tabs
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
        const fallback = () => (<div>...</div>);

        return (tabs ? inspector(tabs) : fallback());
    }
}
