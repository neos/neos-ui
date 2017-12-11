import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {neos} from '@neos-project/neos-ui-decorators';
import {actions} from '@neos-project/neos-ui-redux-store';

@connect(null, {
    cutNode: actions.CR.Nodes.cut
})
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class CutSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        contextPath: PropTypes.string,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,
        isActive: PropTypes.bool.isRequired,
        cutNode: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        canBeEdited: PropTypes.bool.isRequired
    };

    handleCutSelectedNodeClick = () => {
        const {contextPath, cutNode} = this.props;

        cutNode(contextPath);
    }

    render() {
        const {
            destructiveOperationsAreDisabled,
            isActive,
            className,
            i18nRegistry,
            canBeEdited
        } = this.props;

        return (
            <IconButton
                className={className}
                isActive={isActive}
                isDisabled={destructiveOperationsAreDisabled || !canBeEdited}
                onClick={this.handleCutSelectedNodeClick}
                icon="cut"
                tooltipLabel={i18nRegistry.translate('cut')}
                hoverStyle="clean"
                />
        );
    }
}
