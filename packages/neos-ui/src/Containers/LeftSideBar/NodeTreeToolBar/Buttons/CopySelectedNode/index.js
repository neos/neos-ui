import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class CopySelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        focusedNodeContextPath: PropTypes.string,

        onClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {focusedNodeContextPath, onClick} = this.props;

        onClick(focusedNodeContextPath);
    }

    render() {
        const {
            focusedNodeContextPath,
            className
        } = this.props;

        return (
            <IconButton
                className={className}
                isDisabled={Boolean(focusedNodeContextPath) === false}
                onClick={this.handleClick}
                icon="copy"
                tooltipLabel="Copy"
                hoverStyle="clean"
                />
        );
    }
}
