import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class HideSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        id: PropTypes.string,

        disabled: PropTypes.bool.isRequired,
        isHidden: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    render() {
        const {className, id, disabled, isHidden, i18nRegistry, onClick} = this.props;

        return (
            <IconButton
                className={className}
                id={id}
                isActive={isHidden}
                disabled={disabled}
                onClick={onClick}
                icon="eye-slash"
                hoverStyle="brand"
                title={i18nRegistry.translate('hideUnhide')}
                />
        );
    }
}
