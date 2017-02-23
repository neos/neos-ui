import React from 'react';
import DeleteNodeModal from './DeleteNode/index';
import InsertModeModal from './InsertMode/index';
import SelectNodeTypeModal from './SelectNodeType/index';
import NodeCreationDialog from './NodeCreationDialog/index';

const Modals = () => (
    <div>
        <DeleteNodeModal/>
        <InsertModeModal/>
        <SelectNodeTypeModal/>
        <NodeCreationDialog/>
    </div>
);

export default Modals;
