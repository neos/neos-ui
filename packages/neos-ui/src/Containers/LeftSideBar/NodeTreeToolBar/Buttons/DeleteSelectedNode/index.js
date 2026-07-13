import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {translate} from '@neos-project/neos-ui-i18n';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class DeleteSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        id: PropTypes.string,

        focusedNodeContextPath: PropTypes.string,
        disabled: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {focusedNodeContextPath, onClick} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {className, id, disabled} = this.props;

        return (
            <IconButton
                className={className}
                id={id}
                disabled={disabled}
                onClick={this.handleClick}
                icon="trash-alt"
                hoverStyle="brand"
                title={translate('Neos.Neos.Ui:Main:delete')}
                />
        );
    }
}
