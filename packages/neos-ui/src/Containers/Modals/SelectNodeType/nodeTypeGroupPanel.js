import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import ToggablePanel from '@neos-project/react-ui-components/src/ToggablePanel/';
import Grid from '@neos-project/react-ui-components/src/Grid/';
import {neos} from '@neos-project/neos-ui-decorators';
import escaperegexp from 'lodash.escaperegexp';
import {actions} from '@neos-project/neos-ui-redux-store';

import I18n from '@neos-project/neos-ui-i18n';

import NodeTypeItem from './nodeTypeItem';
import style from './style.css';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
@connect($transform({
    collapsedGroups: $get('ui.addNodeModal.collapsedGroups')
}), {
    toggleNodeTypeGroup: actions.UI.AddNodeModal.toggleGroup
})
class NodeTypeGroupPanel extends PureComponent {
    static propTypes = {
        toggleNodeTypeGroup: PropTypes.func.isRequired,
        collapsedGroups: PropTypes.array.isRequired,
        filterSearchTerm: PropTypes.string,

        group: PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            nodeTypes: PropTypes.array.isRequired
        }).isRequired,
        onSelect: PropTypes.func.isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    render() {
        const {
            group,
            collapsedGroups,
            onSelect,
            filterSearchTerm,
            i18nRegistry
        } = this.props;
        const {name, label, nodeTypes} = group;

        const filteredNodeTypes = (nodeTypes || [])
            .filter(nodeType => {
                const label = i18nRegistry.translate(nodeType.label, nodeType.label);
                if (label.toLowerCase().search(escaperegexp(filterSearchTerm.toLowerCase())) !== -1) {
                    return true;
                }
                return false;
            });

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
                        {filteredNodeTypes.map((nodeType, key) => <NodeTypeItem nodeType={nodeType} key={key} onSelect={onSelect}/>)}
                    </Grid>
                </ToggablePanel.Contents>
            </ToggablePanel>
        );
    }

    handleToggleGroup = () => {
        const {
            toggleNodeTypeGroup,
            group
        } = this.props;
        const {name} = group;

        toggleNodeTypeGroup(name);
    }
}

export default NodeTypeGroupPanel;
