import React, {Component, PropTypes} from 'react';
import {Maybe} from 'monet';

import {ToggablePanel} from 'Components/index';
import {I18n} from 'Host/Containers/index';

import EditorEnvelope from '../EditorEnvelope/index';
import style from '../../style.css';

export default class PropertyGroup extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        properties: PropTypes.array
    };

    render() {
        const {properties, label} = this.props;
        const propertyGroup = properties => (
            <ToggablePanel className={style.rightSideBar__section}>
                <ToggablePanel.Header>
                    <I18n id={label} />
                </ToggablePanel.Header>
                <ToggablePanel.Contents>
                    {properties.map(property => (
                        <EditorEnvelope
                            key={property.id}
                            id={property.id}
                            label={property.label}
                            editor={property.editor}
                            />
                    ))}
                </ToggablePanel.Contents>
            </ToggablePanel>
        );
        const fallback = () => (<div>...</div>);

        return Maybe.fromNull(properties).map(propertyGroup).orSome(fallback());
    }
}
