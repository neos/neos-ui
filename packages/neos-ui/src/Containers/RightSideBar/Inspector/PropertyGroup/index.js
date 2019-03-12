import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Maybe} from 'monet';
import {$get} from 'plow-js';
import ToggablePanel from '@neos-project/react-ui-components/src/ToggablePanel/';
import Icon from '@neos-project/react-ui-components/src/Icon/';

import I18n from '@neos-project/neos-ui-i18n';

import InspectorEditorEnvelope from '../InspectorEditorEnvelope/index';
import InspectorViewEnvelope from '../InspectorViewEnvelope/index';
import sidebarStyle from '../../style.css';
import style from './style.css';

export default class PropertyGroup extends PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
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

    render() {
        const {items, label, icon, collapsed, handlePanelToggle, handleInspectorApply, renderSecondaryInspector, node, commit} = this.props;
        const headerTheme = {
            panel__headline: style.propertyGroupLabel // eslint-disable-line camelcase
        };

        const propertyGroup = items => (
            <ToggablePanel onPanelToggle={handlePanelToggle} isOpen={!collapsed} className={sidebarStyle.rightSideBar__section}>
                <ToggablePanel.Header theme={headerTheme}>
                    {icon && <div className={style.iconWrapper}><Icon icon={icon}/></div>} <I18n id={label}/>
                </ToggablePanel.Header>
                <ToggablePanel.Contents>
                    {items.map(item => {
                        const itemId = $get('id', item);
                        const itemType = $get('type', item);
                        const label = $get('label', item) || '';

                        if ($get('hidden', item)) {
                            return null;
                        }
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
        const fallback = () => (<div>...</div>);

        return Maybe.fromNull(items).map(propertyGroup).orSome(fallback());
    }
}
