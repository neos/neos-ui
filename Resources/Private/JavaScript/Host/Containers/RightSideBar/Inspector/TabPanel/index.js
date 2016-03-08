import React, {PropTypes} from 'react';
import {$get} from 'plow-js';

import NeosPropTypes from 'Shared/PropTypes/index';
import {
    Tabs,
    ToggablePanel,
    Label,
    TextInput,
    I18n
} from 'Components/index';


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

const prepareListOfPropertiesToBeEdited = (inspectorGroup, focusedNode) => {
    const nodeTypeProperties = focusedNode.nodeType.properties;
    return Object.keys(nodeTypeProperties).map(propertyId => ({
        ...nodeTypeProperties[propertyId],
        id: propertyId
    }))
    .filter((property) => $get('ui.inspector.group', property) === inspectorGroup.id)
    .sort((a, b) => (a.position - b.position) || (a.id - b.id));
};

const renderEditors = (inspectorGroup, focusedNode) => {
    const listOfProperties = prepareListOfPropertiesToBeEdited(inspectorGroup, focusedNode);
    return listOfProperties.map(property => renderEditor(property, focusedNode));
};

const renderEditor = (property, focusedNode) => {
    return <div key={property.id}>
        <Label htmlFor="testInput">
            <I18n id={property.ui.label} />
        </Label>
        <TextInput placeholder="Type to search" id="testInput" value={focusedNode.properties[property.id]} />
    </div>;
}

const renderInspectorGroup = (inspectorGroup, focusedNode) => {
    return (<ToggablePanel className={style.rightSideBar__section} key={inspectorGroup.id}>
        <ToggablePanel.Header>
            <I18n id={inspectorGroup.label}/>
        </ToggablePanel.Header>
        <ToggablePanel.Contents>
            {renderEditors(inspectorGroup, focusedNode)}
        </ToggablePanel.Contents>
    </ToggablePanel>);
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
