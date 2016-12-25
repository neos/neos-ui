import React, {Component, PropTypes} from 'react';
import {Maybe} from 'monet';
import ToggablePanel from '@neos-project/react-ui-components/lib/ToggablePanel/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';

import I18n from '@neos-project/neos-ui-i18n';

import InspectorEditorEnvelope from '../InspectorEditorEnvelope/index';
import sidebarStyle from '../../style.css';
import style from './style.css';

export default class PropertyGroup extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
        properties: PropTypes.array,
        renderSecondaryInspector: PropTypes.func.isRequired,
        validationErrors: PropTypes.object,

        node: PropTypes.object.isRequired,
        commit: PropTypes.func.isRequired,
        transient: PropTypes.object
    };

    render() {
        const {properties, label, icon, renderSecondaryInspector, transient, validationErrors, node, commit} = this.props;
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
                        const validationErrorsForProperty = (validationErrors && propertyId in validationErrors) ? validationErrors[propertyId] : null;
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
                                transient={transient}
                                validationErrors={validationErrorsForProperty}
                                />);
                    })}
                </ToggablePanel.Contents>
            </ToggablePanel>
        );
        const fallback = () => (<div>...</div>);

        return Maybe.fromNull(properties).map(propertyGroup).orSome(fallback());
    }
}
