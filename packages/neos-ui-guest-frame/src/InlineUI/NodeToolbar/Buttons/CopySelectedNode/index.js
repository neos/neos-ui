import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {translate} from '@neos-project/neos-ui-i18n';
import {Icon, Button} from '@neos-project/react-ui-components';

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
        const {destructiveOperationsAreDisabled, className, isCopied} = this.props;

        return (
            <Button
                id="neos-InlineToolbar-CopySelectedNode"
                className={className}
                disabled={destructiveOperationsAreDisabled}
                isActive={isCopied}
                onClick={this.handleCopySelectedNodeClick}
                hoverStyle="brand"
                style="transparent"
                size="small"
                title={translate('Neos.Neos.Ui:Main:copy')}
            >
                {translate('Neos.Neos.Ui:Main:copy')}
                <Icon icon="far copy" />
            </Button>
        );
    }
}
