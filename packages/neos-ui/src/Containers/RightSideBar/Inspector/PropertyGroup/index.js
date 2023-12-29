import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Maybe} from 'monet';
import {$get} from 'plow-js';
import {ToggablePanel, Icon} from '@neos-project/react-ui-components';

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
                        const itemId = $get('id', item);
                        const itemType = $get('type', item);
                        const label = $get('label', item) || '';

                        if (itemType === 'editor') {
                            return (
                                <InspectorEditorEnvelope
                                    key={$get('contextPath', node) + itemId}
                                    id={itemId}
                                    label={label}
                                    editor={$get('editor', item)}
                                    options={$get('editorOptions', item) && $get('editorOptions', item)}
                                    renderSecondaryInspector={renderSecondaryInspector}
                                    node={node}
                                    commit={commit}
                                    onEnterKey={handleInspectorApply}
                                    helpMessage={$get('helpMessage', item)}
                                    helpThumbnail={$get('helpThumbnail', item)}
                                />);
                        }
                        if (itemType === 'view') {
                            return (
                                <InspectorViewEnvelope
                                    key={$get('contextPath', node) + itemId}
                                    id={itemId}
                                    label={$get('label', item)}
                                    view={$get('view', item)}
                                    options={$get('viewOptions', item)}
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

        const visibleItems = items ? items.filter(item => !$get('hidden', item)) : [];

        return Maybe.fromEmpty(visibleItems).map(this.renderPropertyGroup).orSome(null);
    }
}
