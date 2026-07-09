import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {translate} from '@neos-project/neos-ui-i18n';
import {Icon, Button} from '@neos-project/react-ui-components';

import {actions} from '@neos-project/neos-ui-redux-store';

@connect(null, {
    cutNode: actions.CR.Nodes.cut
})
export default class CutSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        contextPath: PropTypes.string,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,
        isCut: PropTypes.bool.isRequired,
        canBeEdited: PropTypes.bool.isRequired,
        cutNode: PropTypes.func.isRequired
    };

    handleCutSelectedNodeClick = () => {
        const {contextPath, cutNode} = this.props;

        cutNode(contextPath);
    }

    render() {
        const {
            destructiveOperationsAreDisabled,
            isCut,
            className,
            canBeEdited
        } = this.props;

        return (
            <Button
                id="neos-InlineToolbar-CutSelectedNode"
                className={className}
                isActive={isCut}
                disabled={destructiveOperationsAreDisabled || !canBeEdited}
                onClick={this.handleCutSelectedNodeClick}
                hoverStyle="brand"
                style="transparent"
                size="small"
                title={translate('Neos.Neos.Ui:Main:cut')}
            >
                {translate('Neos.Neos.Ui:Main:cut')}
                <Icon icon="cut" />
            </Button>
        );
    }
}
