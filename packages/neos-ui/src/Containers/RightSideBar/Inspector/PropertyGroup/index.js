import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Maybe} from 'monet';
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
        properties: PropTypes.array,
        views: PropTypes.array,
        renderSecondaryInspector: PropTypes.func.isRequired,

        node: PropTypes.object.isRequired,
        commit: PropTypes.func.isRequired
    };

    render() {
        const {properties, views, label, icon, renderSecondaryInspector, node, commit} = this.props;
        const headerTheme = {
            panel__headline: style.propertyGroupLabel // eslint-disable-line camelcase
        };

        const propertyGroup = properties => (
            <ToggablePanel isOpen={true} className={sidebarStyle.rightSideBar__section}>
                <ToggablePanel.Header theme={headerTheme}>
                    {icon && <Icon icon={icon}/>} <I18n id={label}/>
                </ToggablePanel.Header>
                <ToggablePanel.Contents>
                    {properties.map(property => {
                        const propertyId = property.id;
                        return (
                            <InspectorEditorEnvelope
                                key={propertyId}
                                id={propertyId}
                                label={property.label}
                                editor={property.editor}
                                options={property.editorOptions}
                                renderSecondaryInspector={renderSecondaryInspector}
                                node={node}
                                commit={commit}
                                />);
                    })}
                    {views.map(view => {
                        const viewId = view.id;
                        return (
                            <InspectorViewEnvelope
                                key={viewId}
                                id={viewId}
                                label={view.label}
                                view={view.view}
                                options={view.viewOptions}
                                renderSecondaryInspector={renderSecondaryInspector}
                                node={node}
                                commit={commit}
                                />);
                    })}
                </ToggablePanel.Contents>
            </ToggablePanel>
        );
        const fallback = () => (<div></div>);

        return Maybe.fromNull(properties.length > 0 ? properties : null).map(propertyGroup).orSome(fallback());
    }
}
