import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Tabs from '@neos-project/react-ui-components/src/Tabs/';

import PropertyGroup from '../PropertyGroup/index';

import style from './style.module.css';

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

        if (item?.hidden) {
            return false;
        }

        return node?.policy?.canEdit && !node?.policy?.disallowedProperties?.includes(item.id);
    };

    renderTabPanel = groups => {
        const {handlePanelToggle, handleInspectorApply, toggledPanels, renderSecondaryInspector, node, commit} = this.props;

        return (
            <Tabs.Panel theme={{panel: style.inspectorTabPanel}}>
                {groups.map(group => (
                    <PropertyGroup
                        handlePanelToggle={() => handlePanelToggle([group?.id])}
                        handleInspectorApply={handleInspectorApply}
                        key={group?.id}
                        label={group?.label}
                        icon={group?.icon}
                        // Overlay default collapsed state over current state
                        collapsed={Boolean(toggledPanels?.[group?.id]) !== Boolean(group?.collapsed)}
                        items={group?.items?.filter(this.isPropertyEnabled) ?? []}
                        renderSecondaryInspector={renderSecondaryInspector}
                        node={node}
                        commit={commit}
                    />
                ))}
            </Tabs.Panel>
        );
    }

    render() {
        const {groups} = this.props;

        const visibleGroups = groups ? groups.filter(group => group?.items?.some(this.isPropertyEnabled)) : [];

        return this.renderTabPanel(visibleGroups);
    }
}
