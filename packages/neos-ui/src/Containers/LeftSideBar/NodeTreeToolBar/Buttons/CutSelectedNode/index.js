import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class CutSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        focusedNodeContextPath: PropTypes.string,
        isDisabled: PropTypes.bool.isRequired,
        isActive: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {focusedNodeContextPath, onClick} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {className, isDisabled, isActive} = this.props;

        return (
            <IconButton
                className={className}
                isDisabled={isDisabled}
                isActive={isActive}
                onClick={this.handleClick}
                icon="cut"
                hoverStyle="clean"
                />
        );
    }
}
