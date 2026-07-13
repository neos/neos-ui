import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {translate} from '@neos-project/neos-ui-i18n';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class AddNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        id: PropTypes.string,
        onClick: PropTypes.func.isRequired,
        focusedNodeContextPath: PropTypes.string,
        disabled: PropTypes.bool.isRequired
    };

    handleClick = () => {
        const {onClick, focusedNodeContextPath} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {focusedNodeContextPath, disabled, className, id} = this.props;

        return (
            <span>
                <IconButton
                    disabled={Boolean(focusedNodeContextPath) === false || disabled}
                    className={className}
                    id={id}
                    icon="plus"
                    onClick={this.handleClick}
                    hoverStyle="brand"
                    title={translate('Neos.Neos.Ui:Main:createNew')}
                    />
            </span>
        );
    }
}
