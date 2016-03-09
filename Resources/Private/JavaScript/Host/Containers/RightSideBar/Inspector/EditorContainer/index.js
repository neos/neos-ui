import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {CR} from 'Host/Selectors/';
import {Label, TextInput, I18n} from 'Host/Components/';

const prepareListOfPropertiesToBeEdited = (inspectorGroup, focusedNode) => {
    const nodeTypeProperties = focusedNode.nodeType.properties;
    return Object.keys(nodeTypeProperties).map(propertyId => ({
        ...nodeTypeProperties[propertyId],
        id: propertyId
    }))
    .filter((property) => $get('ui.inspector.group', property) === inspectorGroup.id)
    .sort((a, b) => (a.position - b.position) || (a.id - b.id));
};

const renderEditor = (property, focusedNode) => {
    return (<div key={property.id}>
        <Label htmlFor="testInput">
            <I18n id={property.ui.label} />
        </Label>
        <TextInput placeholder="Type to search" id="testInput" value={focusedNode.properties[property.id]} />
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
                {listOfProperties.map(property => renderEditor(property, this.props.focusedNode))}
            </div>);
    }
}
