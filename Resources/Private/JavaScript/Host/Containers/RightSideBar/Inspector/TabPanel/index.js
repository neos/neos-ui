import React, {PropTypes} from 'react';

import {
    Tabs,
    ToggablePanel,
    Label,
    TextInput,
    I18n
} from 'Components/index';
import NeosPropTypes from 'Shared/PropTypes/index';

import style from '../../style.css';

const generateInspectorGroups = (nodeType, tabIdentifier) => {
    const groups = nodeType.ui.inspector.groups;

    return Object.keys(groups)
        .map(groupId => ({
            ...groups[groupId],
            id: groupId
        }))
        .filter((group) => group.tab === tabIdentifier)
        .sort((a, b) => (a.position - b.position) || (a.id - b.id));
};

const renderInspectorGroup = inspectorGroup => {
    return (
        <ToggablePanel className={style.rightSideBar__section} key={inspectorGroup.id}>
            <ToggablePanel.Header>
                <I18n id={inspectorGroup.label} fallback={inspectorGroup.label} />
            </ToggablePanel.Header>
            <ToggablePanel.Contents>
                <Label htmlFor="testInput">
                    Title
                </Label>
                <TextInput placeholder="Type to search" id="testInput" />
            </ToggablePanel.Contents>
        </ToggablePanel>
    );
};

const TabPanel = props => {
    const inspectorGroups = generateInspectorGroups(props.focusedNode.nodeType, props.tab.id);

    return (
        <Tabs.Panel>
            {inspectorGroups.map(inspectorGroup => renderInspectorGroup(inspectorGroup, props.focusedNode))}
        </Tabs.Panel>
    );
};
TabPanel.displayName = 'Inspector Tab Panel';
TabPanel.propTypes = {
    tab: PropTypes.object.isRequired,
    focusedNode: NeosPropTypes.cr.node.isRequired
};

export default TabPanel;
