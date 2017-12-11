import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import I18n from '@neos-project/neos-ui-i18n';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class CopySelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        focusedNodeContextPath: PropTypes.string,

        onClick: PropTypes.func.isRequired,

        isDisabled: PropTypes.bool,

        isActive: PropTypes.bool
    };

    handleClick = () => {
        const {focusedNodeContextPath, onClick} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {
            className,
            isDisabled,
            isActive
        } = this.props;

        const tooltipLabel = <I18n id="Neos.Neos:Main:copy" fallback="Copy"/>;

        return (
            <IconButton
                tooltipLabel={tooltipLabel}
                className={className}
                isDisabled={isDisabled}
                isActive={isActive}
                onClick={this.handleClick}
                icon="copy"
                hoverStyle="clean"
                />
        );
    }
}
