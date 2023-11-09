import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Maybe} from 'monet';

import ToggablePanel from '@neos-project/react-ui-components/src/ToggablePanel/';
import Icon from '@neos-project/react-ui-components/src/Icon/';

import I18n from '@neos-project/neos-ui-i18n';

import InspectorEditorEnvelope from '../InspectorEditorEnvelope/index';
import InspectorViewEnvelope from '../InspectorViewEnvelope/index';
import sidebarStyle from '../../style.module.css';
import style from './style.module.css';

export default class PropertyGroup extends PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
        items: PropTypes.array,
        collapsed: PropTypes.bool,
        properties: PropTypes.object,
        views: PropTypes.object,
        renderSecondaryInspector: PropTypes.func.isRequired,

        node: PropTypes.object.isRequired,
        handlePanelToggle: PropTypes.func.isRequired,
        handleInspectorApply: PropTypes.func,
        commit: PropTypes.func.isRequired
    };

    static defaultProps = {
        collapsed: false
    };

    renderPropertyGroup = items => {
        const {label, icon, collapsed, handlePanelToggle, handleInspectorApply, renderSecondaryInspector, node, commit} = this.props;

        const headerTheme = {
            panel__headline: style.propertyGroupLabel // eslint-disable-line camelcase
        };

        return (
            <ToggablePanel onPanelToggle={handlePanelToggle} isOpen={!collapsed} className={sidebarStyle.rightSideBar__section}>
                <ToggablePanel.Header theme={headerTheme}>
                    {icon && <div className={style.iconWrapper}><Icon icon={icon}/></div>} <I18n id={label}/>
                </ToggablePanel.Header>
                <ToggablePanel.Contents>
                    {items.map(item => {
                        const itemId = item?.id;
                        const itemType = item?.type;
                        const label = item?.label || '';

                        if (itemType === 'editor') {
                            return (
                                <InspectorEditorEnvelope
                                    key={node?.contextPath + itemId}
                                    id={itemId}
                                    label={label}
                                    editor={item?.editor}
                                    options={item?.editorOptions}
                                    renderSecondaryInspector={renderSecondaryInspector}
                                    node={node}
                                    commit={commit}
                                    onEnterKey={handleInspectorApply}
                                    helpMessage={item?.helpMessage}
                                    helpThumbnail={item?.helpThumbnail}
                                />);
                        }
                        if (itemType === 'view') {
                            return (
                                <InspectorViewEnvelope
                                    key={node?.contextPath + itemId}
                                    id={itemId}
                                    label={item?.label}
                                    view={item?.view}
                                    options={item?.viewOptions}
                                    renderSecondaryInspector={renderSecondaryInspector}
                                    node={node}
                                    commit={commit}
                                />);
                        }
                        return null;
                    })}
                </ToggablePanel.Contents>
            </ToggablePanel>
        );
    }

    render() {
        const {items} = this.props;

        const visibleItems = items ? items.filter(item => !item?.hidden) : [];

        return Maybe.fromEmpty(visibleItems).map(this.renderPropertyGroup).orSome(null);
    }
}
