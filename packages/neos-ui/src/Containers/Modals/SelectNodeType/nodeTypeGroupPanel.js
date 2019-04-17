import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import ToggablePanel from '@neos-project/react-ui-components/src/ToggablePanel/';
import {neos} from '@neos-project/neos-ui-decorators';
import escaperegexp from 'lodash.escaperegexp';
import {actions} from '@neos-project/neos-ui-redux-store';

import ReactMarkdown from 'react-markdown';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import I18n from '@neos-project/neos-ui-i18n';

import NodeTypeItem from './nodeTypeItem';
import style from './style.css';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect($transform({
    toggledGroups: $get('ui.addNodeModal.toggledGroups')
}), {
    toggleNodeTypeGroup: actions.UI.AddNodeModal.toggleGroup
})
class NodeTypeGroupPanel extends PureComponent {
    static propTypes = {
        nodeTypesRegistry: PropTypes.object.isRequired,
        toggleNodeTypeGroup: PropTypes.func.isRequired,
        toggledGroups: PropTypes.array.isRequired,
        filterSearchTerm: PropTypes.string,

        group: PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            nodeTypes: PropTypes.array.isRequired,
            collapsed: PropTypes.bool
        }).isRequired,
        onSelect: PropTypes.func.isRequired,

        showHelpMessageFor: PropTypes.string.isRequired,
        activeHelpMessageGroupPanel: PropTypes.string.isRequired,
        onHelpMessage: PropTypes.func.isRequired,
        onCloseHelpMessage: PropTypes.func.isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    componentDidUpdate() {
        this.scrollIntoView();
    }

    scrollIntoView() {
        const {
            showHelpMessageFor,
            activeHelpMessageGroupPanel,
            group
        } = this.props;

        if (showHelpMessageFor !== '' && activeHelpMessageGroupPanel !== group.name) {
            const helpMessage = document.querySelector('#nodeTypeGroupPanelhelpMessage');
            const scrollParent = document.getElementById('neos-SelectNodeTypeDialog').querySelector('.dialog__body');

            if (helpMessage && scrollParent && scrollParent.getBoundingClientRect().bottom < helpMessage.getBoundingClientRect().top + 100) {
                scrollParent.scrollTop += helpMessage.getBoundingClientRect().bottom - scrollParent.getBoundingClientRect().bottom;
            }
        }
    }

    renderHelpMessage = () => {
        const {
            i18nRegistry,
            nodeTypesRegistry,
            activeHelpMessageGroupPanel,
            showHelpMessageFor,
            onCloseHelpMessage,
            group
        } = this.props;

        const nodeType = nodeTypesRegistry.getNodeType(showHelpMessageFor);
        const message = i18nRegistry.translate($get('ui.help.message', nodeType));
        const thumbnail = $get('ui.help.thumbnail', nodeType);

        const icon = $get('ui.icon', nodeType);
        const label = $get('ui.label', nodeType);

        if (activeHelpMessageGroupPanel !== group.name) {
            return null;
        }

        return (
            <div className={style.helpMessage__wrapper} id="nodeTypeGroupPanelhelpMessage">
                <div className={style.helpMessage}>
                    <span className={style.helpMessage__label}>
                        {icon && <Icon icon={icon} className={style.nodeType__icon} padded="right"/>}
                        <I18n id={label} fallback={label}/>
                    </span>
                    {thumbnail ? <img alt={label} src={thumbnail} className={style.helpThumbnail} /> : ''}
                    <ReactMarkdown source={message} />
                </div>

                <IconButton className={style.helpMessage__closeButton} icon="times" onClick={onCloseHelpMessage} />
            </div>
        );
    }

    render() {
        const {
            group,
            toggledGroups,
            onSelect,
            filterSearchTerm,
            i18nRegistry,
            onHelpMessage,
            showHelpMessageFor
        } = this.props;
        const {name, label, nodeTypes} = group;

        const showHelpMessage = showHelpMessageFor !== '';

        const filteredNodeTypes = (nodeTypes || [])
            .filter(nodeType => {
                const label = i18nRegistry.translate(nodeType.label, nodeType.label);
                if (label.toLowerCase().search(escaperegexp(filterSearchTerm.toLowerCase())) !== -1) {
                    return true;
                }
                return false;
            });

        // Take `collapsed: true` group setting into account
        // force open state if a filterSearchTerm is set
        const isOpen = filterSearchTerm.length > 0 ? true : $get('collapsed', group) ? toggledGroups.includes(name) : !toggledGroups.includes(name);

        return (
            <ToggablePanel
                isOpen={isOpen}
                onPanelToggle={this.handleToggleGroup}
                >
                <ToggablePanel.Header className={style.groupHeader}>
                    <I18n className={style.groupTitle} fallback={label} id={label}/>
                </ToggablePanel.Header>
                <ToggablePanel.Contents className={style.groupContents}>
                    {filteredNodeTypes.length > 0 ? (
                        filteredNodeTypes.map((nodeType, key) => <NodeTypeItem nodeType={nodeType} key={key} onSelect={onSelect} onHelpMessage={onHelpMessage} groupName={group.name} />)
                    ) : (
                        <div className={style.noMatchesFound}>
                            <Icon icon="ban" padded="right"/>{i18nRegistry.translate('noMatchesFound')}.
                        </div>
                    )}
                    {showHelpMessage ? this.renderHelpMessage() : null}
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
