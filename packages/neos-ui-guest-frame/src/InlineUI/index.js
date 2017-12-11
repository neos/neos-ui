import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$transform, $get, $contains} from 'plow-js';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import NodeToolbar from './NodeToolbar/index';

import style from './style.css';

@connect($transform({
    focused: $get('cr.nodes.focused'),
    focusedNode: selectors.CR.Nodes.focusedSelector,
    shouldScrollIntoView: selectors.UI.ContentCanvas.shouldScrollIntoView,
    destructiveOperationsAreDisabled: selectors.CR.Nodes.destructiveOperationsAreDisabledSelector,
    clipboardMode: $get('cr.nodes.clipboardMode'),
    clipboardNodeContextPath: selectors.CR.Nodes.clipboardNodeContextPathSelector
}), {
    requestScrollIntoView: actions.UI.ContentCanvas.requestScrollIntoView
})
export default class InlineUI extends PureComponent {
    static propTypes = {
        focused: PropTypes.object,
        focusedNode: PropTypes.object,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,
        requestScrollIntoView: PropTypes.func.isRequired,
        shouldScrollIntoView: PropTypes.bool.isRequired,
        clipboardMode: PropTypes.string.isRequired,
        clipboardNodeContextPath: PropTypes.string
    };

    render() {
        const focused = this.props.focused.toJS();
        const focusedNodeContextPath = focused.contextPath;
        const {shouldScrollIntoView, requestScrollIntoView, destructiveOperationsAreDisabled, clipboardMode, clipboardNodeContextPath} = this.props;
        const isCut = focusedNodeContextPath === clipboardNodeContextPath && clipboardMode === 'Move';
        const isCopied = focusedNodeContextPath === clipboardNodeContextPath && clipboardMode === 'Copy';
        const canBeDeleted = $get('policy.canRemove', this.props.focusedNode);
        const canBeEdited = $get('policy.canEdit', this.props.focusedNode);
        const visibilityCanBeToggled = !$contains('_hidden', 'policy.disallowedProperties', this.props.focusedNode);

        return (
            <div className={style.inlineUi} data-__neos__inline-ui="TRUE">
                <NodeToolbar
                    shouldScrollIntoView={shouldScrollIntoView}
                    requestScrollIntoView={requestScrollIntoView}
                    destructiveOperationsAreDisabled={destructiveOperationsAreDisabled}
                    isCut={isCut}
                    isCopied={isCopied}
                    canBeDeleted={canBeDeleted}
                    canBeEdited={canBeEdited}
                    visibilityCanBeToggled={visibilityCanBeToggled}
                    {...focused}
                    />
            </div>
        );
    }
}
