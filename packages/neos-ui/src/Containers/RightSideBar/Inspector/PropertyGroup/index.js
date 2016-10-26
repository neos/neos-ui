import React, {Component, PropTypes} from 'react';
import {Maybe} from 'monet';
import ToggablePanel from '@neos-project/react-ui-components/lib/ToggablePanel/';

import I18n from '@neos-project/neos-ui-i18n';

import EditorEnvelope from '../EditorEnvelope/index';
import sidebarStyle from '../../style.css';
import style from './style.css';

export default class PropertyGroup extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        properties: PropTypes.array,
        renderSecondaryInspector: PropTypes.func.isRequired
    };

    render() {
        const {properties, label, renderSecondaryInspector} = this.props;
        const headerTheme = {
            panel__headline: style.propertyGroupLabel // eslint-disable-line camelcase
        };
        const propertyGroup = properties => (
            <ToggablePanel isOpen={true} className={sidebarStyle.rightSideBar__section}>
                <ToggablePanel.Header theme={headerTheme}>
                    <I18n id={label}/>
                </ToggablePanel.Header>
                <ToggablePanel.Contents>
                    {properties.map(property => (
                        <EditorEnvelope
                            key={property.id}
                            id={property.id}
                            label={property.label}
                            editor={property.editor}
                            options={property.editorOptions}
                            renderSecondaryInspector={renderSecondaryInspector}
                            />
                    ))}
                </ToggablePanel.Contents>
            </ToggablePanel>
        );
        const fallback = () => (<div>...</div>);

        return Maybe.fromNull(properties).map(propertyGroup).orSome(fallback());
    }
}
