import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import I18n from '@neos-project/neos-ui-i18n';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class DeleteSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        focusedNodeContextPath: PropTypes.string.isRequired,
        isDisabled: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {focusedNodeContextPath, onClick} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {className, isDisabled} = this.props;
        const tooltipLabel = <I18n id="Neos.Neos:Main:delete" fallback="Copy"/>;

        return (
            <IconButton
                tooltipLabel={tooltipLabel}
                className={className}
                isDisabled={isDisabled}
                onClick={this.handleClick}
                icon="trash"
                hoverStyle="clean"
                />
        );
    }
}
