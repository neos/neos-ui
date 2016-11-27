import React, {PureComponent, PropTypes} from 'react';
import Button from '@neos-project/react-ui-components/lib/Button/';
import Dialog from '@neos-project/react-ui-components/lib/Dialog/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import I18n from '@neos-project/neos-ui-i18n';
import NodeTypeGroupPanel from './nodeTypeGroupPanel';

//
// Export error messages for testing
//
export const errorMessages = {
    ERROR_INVALID_MODE: 'Provided mode is not within allowed modes list in AddNodeModal.'
};

const calculateActiveMode = (currentMode, allowedNodeTypesByMode) => {
    if (currentMode && allowedNodeTypesByMode[currentMode].length) {
        return currentMode;
    }

    const fallbackOrder = ['insert', 'append', 'prepend'];

    for (let i = 0; i < fallbackOrder.length; i++) {
        if (allowedNodeTypesByMode[fallbackOrder[i]].length) {
            return fallbackOrder[i];
        }
    }

    return '';
};

class Step1 extends PureComponent {
    static propTypes = {
        nodeTypesRegistry: PropTypes.object.isRequired,
        mode: PropTypes.string.isRequired,
        getAllowedNodeTypesByModeGenerator: PropTypes.func.isRequired,
        onHandleModeChange: PropTypes.func.isRequired,
        onHandleClose: PropTypes.func.isRequired,
        onHandleSelectNodeType: PropTypes.func.isRequired
    };

    renderInsertModeSelector(activeMode, allowedNodeTypesByMode) {
        const options = [];

        if (allowedNodeTypesByMode.prepend.length) {
            options.push({
                value: 'prepend',
                label: (<span>
                    <I18n fallback="Create new" id="createNew"/> <I18n fallback="before" id="before"/> <Icon icon="level-up"/>
                </span>)
            });
        }

        if (allowedNodeTypesByMode.append.length) {
            options.push({
                value: 'append',
                label: (<span>
                    <I18n fallback="Create new" id="createNew"/> <I18n fallback="after" id="after"/> <Icon icon="level-down"/>
                </span>)
            });
        }

        if (allowedNodeTypesByMode.insert.length) {
            options.push({
                value: 'insert',
                label: (<span>
                    <I18n fallback="Create new" id="createNew"/> <I18n fallback="into" id="into"/> <Icon icon="long-arrow-right"/>
                </span>)
            });
        }

        return (<SelectBox
            options={options}
            value={activeMode}
            onSelect={this.props.onHandleModeChange}
            />);
    }

    renderCancelAction() {
        return (
            <Button
                key="cancel"
                style="lighter"
                hoverStyle="brand"
                onClick={this.props.onHandleClose}
                >
                <I18n id="TYPO3.Neos:Main:cancel" fallback="Cancel"/>
            </Button>
        );
    }

    render() {
        const {mode, nodeTypesRegistry, getAllowedNodeTypesByModeGenerator, onHandleSelectNodeType} = this.props;
        const allowedNodeTypesByMode = getAllowedNodeTypesByModeGenerator(nodeTypesRegistry);
        const activeMode = calculateActiveMode(mode, allowedNodeTypesByMode);

        const groupedAllowedNodeTypes = nodeTypesRegistry.getGroupedNodeTypeList(allowedNodeTypesByMode[activeMode]);

        return (
            <Dialog
                actions={[this.renderCancelAction()]}
                title={this.renderInsertModeSelector(activeMode, allowedNodeTypesByMode)}
                onRequestClose={close}
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
