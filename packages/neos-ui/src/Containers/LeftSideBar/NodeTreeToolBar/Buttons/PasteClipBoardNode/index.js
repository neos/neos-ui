import React, {PureComponent, PropTypes} from 'react';

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
                onClick={this.handleClick}
                hoverStyle="clean"
                />
        );
    }
}
