import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$contains} from 'plow-js';
import Tabs from '@neos-project/react-ui-components/src/Tabs/';

import PropertyGroup from '../PropertyGroup/index';
import SelectedElement from '../SelectedElement/index';

import style from './style.css';

export default class TabPanel extends PureComponent {
    static displayName = 'Inspector Tab Panel';
    static propTypes = {
        groups: PropTypes.array,
        renderSecondaryInspector: PropTypes.func.isRequired,
        node: PropTypes.object.isRequired,
        commit: PropTypes.func.isRequired
    };

    isPropertyEnabled = ({id}) => {
        const {node} = this.props;

        return !$contains(id, 'policy.disallowedProperties', node);
    };

    render() {
        const {groups, renderSecondaryInspector, node, commit} = this.props;

        if (!groups) {
            return (<div>...</div>);
        }

        return (
            <Tabs.Panel theme={{panel: style.inspectorTabPanel}}>
                <SelectedElement/>
                {
                    groups.filter(g => (g.properties && g.properties.filter(this.isPropertyEnabled).length) || (g.views && g.views.length)).map(group => (
                        <PropertyGroup
                            key={group.id}
                            label={group.label}
                            icon={group.icon}
                            properties={group.properties.filter(this.isPropertyEnabled)}
                            views={group.views}
                            renderSecondaryInspector={renderSecondaryInspector}
                            node={node}
                            commit={commit}
                            />
                    ))
                }
            </Tabs.Panel>
        );
    }
}
