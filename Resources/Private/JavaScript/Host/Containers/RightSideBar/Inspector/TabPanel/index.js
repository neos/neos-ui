import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';

import {CR} from 'Host/Selectors/';
import NeosPropTypes from 'Shared/PropTypes/index';
import {
    Tabs,
    ToggablePanel,
    Label,
    TextInput,
    I18n
} from 'Components/index';

import EditorContainer from '../EditorContainer/index';
import style from '../../style.css';

const generateInspectorGroups = (nodeType, tabIdentifier) => {
    const groups = nodeType.ui.inspector.groups;

    return Object.keys(groups).map(groupId => ({
        ...groups[groupId],
        id: groupId
    }))
    .filter((group) => group.tab === tabIdentifier || (tabIdentifier === 'default' && !group.tab))
    .sort((a, b) => (a.position - b.position) || (a.id - b.id));
};

const renderInspectorGroup = (inspectorGroup) => {
    return (<ToggablePanel className={style.rightSideBar__section} key={inspectorGroup.id}>
        <ToggablePanel.Header>
            <I18n id={inspectorGroup.label}/>
        </ToggablePanel.Header>
        <ToggablePanel.Contents>
            <EditorContainer inspectorGroup={inspectorGroup} />
        </ToggablePanel.Contents>
    </ToggablePanel>);
};

@connect($transform({
    focusedNode: CR.Nodes.focusedSelector
}))
export default class TabPanel extends Component {
    static displayName = 'Inspector Tab Panel';
    static propTypes = {
        tab: PropTypes.object.isRequired,
        focusedNode: PropTypes.object.isRequired
    };

    render() {
        const inspectorGroups = generateInspectorGroups(this.props.focusedNode.nodeType, this.props.tab.id);

        return (
            <Tabs.Panel>
                {inspectorGroups.map(inspectorGroup => renderInspectorGroup(inspectorGroup))}
            </Tabs.Panel>
        );
    }
}
