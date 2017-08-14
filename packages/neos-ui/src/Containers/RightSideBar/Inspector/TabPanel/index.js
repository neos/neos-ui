import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Maybe} from 'monet';
import Tabs from '@neos-project/react-ui-components/src/Tabs/';

import PropertyGroup from '../PropertyGroup/index';

import style from './style.css';

export default class TabPanel extends PureComponent {
    static displayName = 'Inspector Tab Panel';
    static propTypes = {
        groups: PropTypes.array,
        renderSecondaryInspector: PropTypes.func.isRequired,
        node: PropTypes.object.isRequired,
        commit: PropTypes.func.isRequired
    };

    render() {
        const {groups, renderSecondaryInspector, node, commit} = this.props;
        const tabPanel = groups => (
            <Tabs.Panel theme={{panel: style.inspectorTabPanel}}>
                {
                    groups.filter(g => g.properties && g.properties.length).map(group => (
                        <PropertyGroup
                            key={group.id}
                            label={group.label}
                            icon={group.icon}
                            properties={group.properties}
                            views={group.views}
                            renderSecondaryInspector={renderSecondaryInspector}
                            node={node}
                            commit={commit}
                            />
                    ))
                }
            </Tabs.Panel>
        );
        const fallback = () => (<div>...</div>);

        return Maybe.fromNull(groups).map(tabPanel).orSome(fallback());
    }
}
