import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@connect($transform({
    node: selectors.CR.Nodes.focusedSelector
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
        visibilityCanBeToggled: PropTypes.bool.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    handleHideNode = () => {
        const {node, hideNode, canBeEdited, visibilityCanBeToggled} = this.props;

        if (canBeEdited && visibilityCanBeToggled) {
            hideNode($get('contextPath', node));
        }
    }

    handleShowNode = () => {
        const {node, showNode, canBeEdited, visibilityCanBeToggled} = this.props;

        if (canBeEdited && visibilityCanBeToggled) {
            showNode($get('contextPath', node));
        }
    }

    render() {
        const {className, node, destructiveOperationsAreDisabled, canBeEdited, visibilityCanBeToggled, i18nRegistry} = this.props;
        const isHidden = $get('properties._hidden', node);

        return (
            <IconButton
                id="neos-InlineToolbar-HideSelectedNode"
                className={className}
                isActive={isHidden}
                disabled={destructiveOperationsAreDisabled || !canBeEdited || !visibilityCanBeToggled}
                onClick={isHidden ? this.handleShowNode : this.handleHideNode}
                icon="eye-slash"
                hoverStyle="brand"
                title={i18nRegistry.translate('hideUnhide')}
                />
        );
    }
}
