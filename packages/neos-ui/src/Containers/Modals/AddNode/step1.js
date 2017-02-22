import React, {PureComponent, PropTypes} from 'react';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Dialog from '@neos-project/react-ui-components/lib/Dialog/';
import I18n from '@neos-project/neos-ui-i18n';

import {InsertModeSelector} from '@neos-project/neos-ui-containers';
import NodeTypeGroupPanel from './nodeTypeGroupPanel';

class Step1 extends PureComponent {
    static propTypes = {
        nodeTypesRegistry: PropTypes.object.isRequired,
        activeMode: PropTypes.string.isRequired,
        allowedNodeTypesByMode: PropTypes.shape({
            before: PropTypes.array,
            into: PropTypes.array,
            after: PropTypes.array
        }),
        onHandleModeChange: PropTypes.func.isRequired,
        onHandleClose: PropTypes.func.isRequired,
        onHandleSelectNodeType: PropTypes.func.isRequired
    };

    renderInsertModeSelector(activeMode, allowedNodeTypesByMode) {
        return (
            <InsertModeSelector
                mode={activeMode}
                onSelect={this.props.onHandleModeChange}
                enableAlongsideModes={Boolean(allowedNodeTypesByMode.after.length)}
                enableIntoMode={Boolean(allowedNodeTypesByMode.into.length)}
                />
        );
    }

    renderCancelAction() {
        return (
            <Button
                key="cancel"
                style="lighter"
                hoverStyle="brand"
                onClick={this.props.onHandleClose}
                >
                <I18n id="Neos.Neos:Main:cancel" fallback="Cancel"/>
            </Button>
        );
    }

    render() {
        const {activeMode, nodeTypesRegistry, allowedNodeTypesByMode, onHandleSelectNodeType, onHandleClose} = this.props;

        const groupedAllowedNodeTypes = nodeTypesRegistry.getGroupedNodeTypeList(allowedNodeTypesByMode[activeMode]);

        return (
            <Dialog
                actions={[this.renderCancelAction()]}
                title={this.renderInsertModeSelector(activeMode, allowedNodeTypesByMode)}
                onRequestClose={onHandleClose}
                isOpen
                isWide
                >
                {groupedAllowedNodeTypes.map((group, key) => (
                    <div key={key}>
                        <NodeTypeGroupPanel
                            group={group}
                            onSelect={onHandleSelectNodeType}
                            />
                    </div>
                ))}
            </Dialog>
        );
    }
}

export default Step1;
