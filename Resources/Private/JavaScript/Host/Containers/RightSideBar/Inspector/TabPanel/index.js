import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {CR} from 'Host/Selectors/';
import NeosPropTypes from 'Shared/PropTypes/index';
import {
    Tabs,
    ToggablePanel,
    I18n
} from 'Components/index';

import EditorContainer from '../EditorContainer/index';
import style from '../../style.css';

const generateInspectorGroups = (nodeType, tabIdentifier) => {
    let groups = $get('ui.inspector.groups', nodeType);
    groups = (groups && groups.toJS ? groups.toJS() : groups);

    return Object.keys(groups).map(groupId => ({
        ...groups[groupId],
        id: groupId
    }))
    .filter((group) => group.tab === tabIdentifier || (tabIdentifier === 'default' && !group.tab))
    .sort((a, b) => (a.position - b.position) || (a.id - b.id));
};

const renderInspectorGroup = (inspectorGroup) => {
    return (
        <ToggablePanel className={style.rightSideBar__section} key={inspectorGroup.id}>
            <ToggablePanel.Header>
                <I18n id={inspectorGroup.label}/>
            </ToggablePanel.Header>
            <ToggablePanel.Contents>
                <EditorContainer inspectorGroup={inspectorGroup} />
            </ToggablePanel.Contents>
        </ToggablePanel>
    );
};

@connect($transform({
    focusedNode: CR.Nodes.focusedSelector
}))
export default class TabPanel extends Component {
    static displayName = 'Inspector Tab Panel';
    static propTypes = {
        tab: PropTypes.object.isRequired,
        focusedNode: NeosPropTypes.cr.node.isRequired
    };

    render() {
        const inspectorGroups = generateInspectorGroups(
            $get('nodeType', this.props.focusedNode),
            $get('id', this.props.tab)
        );

        return (
            <Tabs.Panel>
                {inspectorGroups.map(inspectorGroup => renderInspectorGroup(inspectorGroup))}
            </Tabs.Panel>
        );
    }
}
