import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {actions} from '@neos-project/neos-ui-redux-store';

@connect(null, {
    copyNode: actions.CR.Nodes.copy
})
export default class CopySelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        contextPath: PropTypes.string,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,
        isCopied: PropTypes.bool.isRequired,
        copyNode: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    handleCopySelectedNodeClick = () => {
        const {contextPath, copyNode} = this.props;

        copyNode(contextPath);
    }

    render() {
        const {destructiveOperationsAreDisabled, className, isCopied, i18nRegistry} = this.props;

        return (
            <IconButton
                id="neos-InlineToolbar-CopySelectedNode"
                className={className}
                disabled={destructiveOperationsAreDisabled}
                isActive={isCopied}
                onClick={this.handleCopySelectedNodeClick}
                icon="far copy"
                hoverStyle="brand"
                title={i18nRegistry.translate('copy')}
                />
        );
    }
}
