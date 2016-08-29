import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import {Maybe} from 'monet';
import Bar from '@neos-project/react-ui-components/lib/Bar/';
import Grid from '@neos-project/react-ui-components/lib/Grid/';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Tabs from '@neos-project/react-ui-components/lib/Tabs/';

import {actions} from 'Host/Redux/index';

import TabPanel from './TabPanel/index';
import style from './style.css';

@connect($get('ui.inspector.viewConfiguration'), {
    apply: actions.UI.Inspector.apply,
    discard: actions.UI.Inspector.discard
})
export default class Inspector extends Component {
    static propTypes = {
        tabs: PropTypes.array,
        apply: PropTypes.func.isRequired,
        discard: PropTypes.func.isRequired
    };

    render() {
        const {tabs, apply, discard} = this.props;
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
                        .map(tab => <TabPanel key={tab.id} title={tab.id} icon={tab.icon} groups={tab.groups}/>)
                    }
                </Tabs>
                <Bar position="bottom">
                    <Grid gutter="micro">
                        <Grid.Col width="half">
                            <Button style="lighter" disabled onClick={discard} className={style.discardBtn}>
                                Discard changes
                            </Button>
                        </Grid.Col>
                        <Grid.Col width="half">
                            <Button style="lighter" disabled onClick={apply} className={style.publishBtn}>
                                Apply
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Bar>
            </div>
        );
        const fallback = () => (<div>...</div>);

        return Maybe.fromNull(tabs).map(inspector).orSome(fallback());
    }
}
