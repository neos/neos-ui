import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {CR} from 'Host/Selectors/';
import {Label, I18n} from 'Host/Components/';
import SingleInspectorEditor from '../SingleInspectorEditor/';

const prepareListOfPropertiesToBeEdited = (inspectorGroup, focusedNode) => {
    const nodeTypeProperties = focusedNode.nodeType.properties;
    return Object.keys(nodeTypeProperties).map(propertyId => ({
        ...nodeTypeProperties[propertyId],
        id: propertyId
    }))
    .filter((property) => $get('ui.inspector.group', property) === inspectorGroup.id)
    .sort((a, b) => (a.position - b.position) || (a.id - b.id));
};

const renderEditor = (property) => {
    return (<div key={property.id}>
        <Label htmlFor="testInput">
            <I18n id={property.ui.label} />
        </Label>
        <SingleInspectorEditor property={property} />
    </div>);
};

@connect($transform({
    focusedNode: CR.Nodes.focusedSelector
}))
export default class EditorContainer extends Component {

    static propTypes = {
        inspectorGroup: PropTypes.object.isRequired,
        focusedNode: PropTypes.object.isRequired
    };

    render() {
        const listOfProperties = prepareListOfPropertiesToBeEdited(this.props.inspectorGroup, this.props.focusedNode);
        return (
            <div>
                {listOfProperties.map(property => renderEditor(property))}
            </div>);
    }
}
