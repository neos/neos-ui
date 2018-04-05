import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get, $contains} from 'plow-js';
import Tabs from '@neos-project/react-ui-components/src/Tabs/';

import PropertyGroup from '../PropertyGroup/index';
import SelectedElement from '../SelectedElement/index';

import style from './style.css';

export default class TabPanel extends PureComponent {
    static displayName = 'Inspector Tab Panel';
    static propTypes = {
        groups: PropTypes.object,
        renderSecondaryInspector: PropTypes.func.isRequired,
        node: PropTypes.object.isRequired,
        commit: PropTypes.func.isRequired
    };

    isPropertyEnabled = ({id}) => {
        const {node} = this.props;

        return !$contains(id, 'policy.disallowedProperties', node);
    };

    render() {
        const {handlePanelToggle, toggledPanels, groups, renderSecondaryInspector, node, commit} = this.props;

        if (!groups) {
            return (<div>...</div>);
        }

        return (
            <Tabs.Panel theme={{panel: style.inspectorTabPanel}}>
                <SelectedElement/>
                {
                    groups.filter(g => ($get('properties', g) && $get('properties', g).filter(this.isPropertyEnabled).count()) || ($get('views', g) && $get('views', g).count())).map(group => (
                        <PropertyGroup
                            handlePanelToggle={() => handlePanelToggle([$get('id', group)])}
                            key={$get('id', group)}
                            label={$get('label', group)}
                            icon={$get('icon', group)}
                            // overlay default collapsed state over current state
                            collapsed={Boolean($get($get('id', group), toggledPanels)) !== Boolean($get('collapsed', group))}
                            properties={$get('properties', group).filter(this.isPropertyEnabled)}
                            views={$get('views', group)}
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
