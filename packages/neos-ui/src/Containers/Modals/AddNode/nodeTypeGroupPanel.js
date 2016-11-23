import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import ToggablePanel from '@neos-project/react-ui-components/lib/ToggablePanel/';
import Grid from '@neos-project/react-ui-components/lib/Grid/';

import {actions} from '@neos-project/neos-ui-redux-store';

import I18n from '@neos-project/neos-ui-i18n';

import NodeTypeItem from './nodeTypeItem';
import style from './style.css';

@connect($transform({
    collapsedGroups: $get('ui.addNodeModal.collapsedGroups')
}), {
    toggleNodeTypeGroup: actions.UI.AddNodeModal.toggleGroup
})
class NodeTypeGroupPanel extends PureComponent {
    static propTypes = {
        toggleNodeTypeGroup: PropTypes.func.isRequired,
        collapsedGroups: PropTypes.array.isRequired,
        group: PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            nodeTypes: PropTypes.array.isRequired
        }).isRequired
    };

    constructor(props) {
        super(props);

        this.handleToggleGroup = this.handleToggleGroup.bind(this);
    }

    render() {
        const {
            group,
            collapsedGroups
        } = this.props;
        const {name, label, nodeTypes} = group;

        return (
            <ToggablePanel
                isOpen={collapsedGroups.includes(name) === false}
                onPanelToggle={this.handleToggleGroup}
                >
                <ToggablePanel.Header className={style.groupHeader}>
                    <I18n className={style.groupTitle} fallback={label} id={label}/>
                </ToggablePanel.Header>
                <ToggablePanel.Contents className={style.groupContents}>
                    <Grid className={style.grid}>
                        {nodeTypes.map((nodeType, key) => <NodeTypeItem nodeType={nodeType} key={key}/>)}
                    </Grid>
                </ToggablePanel.Contents>
            </ToggablePanel>
        );
    }

    handleToggleGroup() {
        const {
            toggleNodeTypeGroup,
            group
        } = this.props;
        const {name} = group;

        toggleNodeTypeGroup(name);
    }
}

export default NodeTypeGroupPanel;
