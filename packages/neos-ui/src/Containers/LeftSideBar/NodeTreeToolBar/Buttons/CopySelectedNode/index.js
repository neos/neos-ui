import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {translate} from '@neos-project/neos-ui-i18n';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class CopySelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        id: PropTypes.string,

        focusedNodeContextPath: PropTypes.string,

        onClick: PropTypes.func.isRequired,

        disabled: PropTypes.bool,

        isActive: PropTypes.bool
    };

    handleClick = () => {
        const {focusedNodeContextPath, onClick} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {
            className,
            id,
            disabled,
            isActive
        } = this.props;

        return (
            <IconButton
                className={className}
                id={id}
                disabled={disabled}
                isActive={isActive}
                onClick={this.handleClick}
                icon="far copy"
                hoverStyle="brand"
                title={translate('Neos.Neos.Ui:Main:copy')}
                />
        );
    }
}
