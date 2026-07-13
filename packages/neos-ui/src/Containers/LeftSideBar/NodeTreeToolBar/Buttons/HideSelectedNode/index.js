import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {translate} from '@neos-project/neos-ui-i18n';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class HideSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        id: PropTypes.string,

        disabled: PropTypes.bool.isRequired,
        isHidden: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired
    };

    render() {
        const {className, id, disabled, isHidden, onClick} = this.props;

        return (
            <IconButton
                className={className}
                id={id}
                isActive={isHidden}
                disabled={disabled}
                onClick={onClick}
                icon="eye-slash"
                hoverStyle="brand"
                title={translate('Neos.Neos.Ui:Main:hideUnhide')}
                />
        );
    }
}
