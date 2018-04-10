import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class ToggleContentTree extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        id: PropTypes.string,

        isPanelOpen: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired,

        i18nRegistry: PropTypes.object.isRequired
    };

    handleClick = () => {
        const {onClick} = this.props;

        onClick();
    }

    render() {
        const {className, id, isPanelOpen, i18nRegistry} = this.props;

        return (
            <IconButton
                id={id}
                className={className}
                onClick={this.handleClick}
                icon={isPanelOpen ? 'chevron-down' : 'chevron-up'}
                hoverStyle="clean"
                aria-label={i18nRegistry.translate('Neos.Neos:Main:toggleContentTree', 'Toggle content tree')}
                />
        );
    }
}
