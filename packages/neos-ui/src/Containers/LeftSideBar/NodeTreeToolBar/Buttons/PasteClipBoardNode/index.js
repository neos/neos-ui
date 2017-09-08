import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class PasteClipBoardNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        focusedNodeContextPath: PropTypes.string.isRequired,
        canBePasted: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {onClick, focusedNodeContextPath} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {
            className,
            canBePasted
        } = this.props;

        return (
            <IconButton
                isDisabled={!canBePasted}
                className={className}
                icon="paste"
                tooltipLabel="Paste"
                onClick={this.handleClick}
                hoverStyle="clean"
                />
        );
    }
}
