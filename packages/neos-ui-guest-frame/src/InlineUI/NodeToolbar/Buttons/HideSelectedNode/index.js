import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {translate} from '@neos-project/neos-ui-i18n';
import {Button, Icon} from '@neos-project/react-ui-components';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@connect(state => ({
    node: selectors.CR.Nodes.focusedSelector(state)
}), {
    hideNode: actions.CR.Nodes.hide,
    showNode: actions.CR.Nodes.show
})
export default class HideSelectedNode extends PureComponent {
    static propTypes = {
        node: PropTypes.object,
        className: PropTypes.string,
        hideNode: PropTypes.func.isRequired,
        showNode: PropTypes.func.isRequired,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,
        canBeEdited: PropTypes.bool.isRequired,
        visibilityCanBeToggled: PropTypes.bool.isRequired
    };

    handleHideNode = () => {
        const {node, hideNode, canBeEdited, visibilityCanBeToggled} = this.props;

        if (canBeEdited && visibilityCanBeToggled) {
            hideNode(node?.contextPath);
        }
    }

    handleShowNode = () => {
        const {node, showNode, canBeEdited, visibilityCanBeToggled} = this.props;

        if (canBeEdited && visibilityCanBeToggled) {
            showNode(node?.contextPath);
        }
    }

    render() {
        const {className, node, destructiveOperationsAreDisabled, canBeEdited, visibilityCanBeToggled} = this.props;
        const isHidden = node?.properties?._hidden;

        return (
            <Button
                id="neos-InlineToolbar-HideSelectedNode"
                className={className}
                isActive={isHidden}
                disabled={destructiveOperationsAreDisabled || !canBeEdited || !visibilityCanBeToggled}
                onClick={isHidden ? this.handleShowNode : this.handleHideNode}
                hoverStyle="brand"
                style="transparent"
                size="small"
                title={isHidden ? translate('Neos.Neos.Ui:Main:unhide') : translate('Neos.Neos.Ui:Main:hide')}
            >
                {isHidden ? translate('Neos.Neos.Ui:Main:unhide') : translate('Neos.Neos.Ui:Main:hide')}
                <Icon
                    icon={isHidden ? 'eye' : 'eye-slash'}
                />
            </Button>
        );
    }
}
