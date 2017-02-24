import React, {PureComponent, PropTypes} from 'react';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    containerRegistry: globalRegistry.get('containers')
}))
export default class Modals extends PureComponent {
    static propTypes = {
        containerRegistry: PropTypes.object.isRequired
    };

    render() {
        const {containerRegistry} = this.props;

        const DeleteNodeModal = containerRegistry.get('Modals/DeleteNodeModal');
        const InsertModeModal = containerRegistry.get('Modals/InsertModeModal');
        const SelectNodeTypeModal = containerRegistry.get('Modals/SelectNodeTypeModal');
        const NodeCreationDialog = containerRegistry.get('Modals/NodeCreationDialog');

        return (
            <div>
                <DeleteNodeModal/>
                <InsertModeModal/>
                <SelectNodeTypeModal/>
                <NodeCreationDialog/>
            </div>

        );
    }
}