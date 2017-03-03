import React, {PureComponent, PropTypes} from 'react';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

export default class DeleteSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        focusedNodeContextPath: PropTypes.string.isRequired,
        isDisabled: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {focusedNodeContextPath, onClick} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {className, isDisabled} = this.props;

        return (
            <IconButton
                className={className}
                isDisabled={isDisabled}
                onClick={this.handleClick}
                icon="trash"
                hoverStyle="clean"
                />
        );
    }
}
