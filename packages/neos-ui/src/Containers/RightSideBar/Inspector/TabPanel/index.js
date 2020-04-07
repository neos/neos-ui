import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get, $contains} from 'plow-js';
import Tabs from '@neos-project/react-ui-components/src/Tabs/';

import PropertyGroup from '../PropertyGroup/index';

import style from './style.css';

export default class TabPanel extends PureComponent {
    static displayName = 'Inspector Tab Panel';

    static propTypes = {
        id: PropTypes.string,
        groups: PropTypes.array,
        renderSecondaryInspector: PropTypes.func.isRequired,
        node: PropTypes.object.isRequired,
        commit: PropTypes.func.isRequired,
        handleInspectorApply: PropTypes.func
    };

    isPropertyEnabled = item => {
        const {node} = this.props;

        if (item.type !== 'editor') {
            return true;
        }

        return $get(['policy', 'canEdit'], node) && !$contains(item.id, 'policy.disallowedProperties', node);
    };

    render() {
        const {handlePanelToggle, handleInspectorApply, toggledPanels, groups, renderSecondaryInspector, node, commit} = this.props;

        if (!groups) {
            return (<div>...</div>);
        }

        return (
            <Tabs.Panel theme={{panel: style.inspectorTabPanel}}>
                {
                    groups.filter(g => ($get('items', g) && $get('items', g).filter(this.isPropertyEnabled).length)).map(group => (
                        <PropertyGroup
                            handlePanelToggle={() => handlePanelToggle([$get('id', group)])}
                            handleInspectorApply={handleInspectorApply}
                            key={$get('id', group)}
                            label={$get('label', group)}
                            icon={$get('icon', group)}
                            // Overlay default collapsed state over current state
                            collapsed={Boolean($get($get('id', group), toggledPanels)) !== Boolean($get('collapsed', group))}
                            items={$get('items', group).filter(this.isPropertyEnabled)}
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
