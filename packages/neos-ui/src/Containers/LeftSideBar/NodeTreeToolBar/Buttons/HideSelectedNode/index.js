import React, {PureComponent, PropTypes} from 'react';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

export default class HideSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        focusedNodeContextPath: PropTypes.string.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        isHidden: PropTypes.bool.isRequired,

        onHide: PropTypes.func.isRequired,
        onShow: PropTypes.func.isRequired
    };

    handleHide = () => {
        const {focusedNodeContextPath, onHide} = this.props;

        onHide(focusedNodeContextPath);
    }

    handleShow = () => {
        const {focusedNodeContextPath, onShow} = this.props;

        onShow(focusedNodeContextPath);
    }

    render() {
        const {className, isDisabled, isHidden} = this.props;

        return (
            <IconButton
                className={className}
                isActive={isHidden}
                isDisabled={isDisabled}
                onClick={isHidden ? this.handleShow : this.handleHide}
                icon="eye-slash"
                hoverStyle="clean"
                />
        );
    }
}
