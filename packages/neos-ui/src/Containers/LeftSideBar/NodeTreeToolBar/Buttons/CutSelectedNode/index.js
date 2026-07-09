import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import {translate} from '@neos-project/neos-ui-i18n';

export default class CutSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        id: PropTypes.string,

        focusedNodeContextPath: PropTypes.string,
        disabled: PropTypes.bool.isRequired,
        isActive: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {focusedNodeContextPath, onClick} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {className, id, disabled, isActive} = this.props;

        return (
            <IconButton
                className={className}
                id={id}
                disabled={disabled}
                isActive={isActive}
                onClick={this.handleClick}
                icon="cut"
                hoverStyle="brand"
                title={translate('Neos.Neos.Ui:Main:cut')}
                />
        );
    }
}
