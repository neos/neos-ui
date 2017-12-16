import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class ToggleContentTree extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        isPanelOpen: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {onClick} = this.props;

        onClick();
    }

    render() {
        const {className, isPanelOpen} = this.props;

        return (
            <IconButton
                id="neos-contentTree-toggle"
                className={className}
                onClick={this.handleClick}
                icon={isPanelOpen ? 'chevron-down' : 'chevron-up'}
                hoverStyle="clean"
                />
        );
    }
}
