import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

export default class AddNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        onClick: PropTypes.func.isRequired,
        focusedNodeContextPath: PropTypes.string.isRequired
    };

    handleClick = () => {
        const {onClick, focusedNodeContextPath} = this.props;

        onClick(focusedNodeContextPath);
    }

    tooltipChildren = () => {
        return (
            <div>
            <div>asdfsdf</div>
          </div>
        )
    }

    render() {
        const {focusedNodeContextPath, className} = this.props;

        return (
            <span>
                <IconButton
                    tooltipLabel="Dies ist ein Label"
                    tooltipChildren={this.tooltipChildren()}
                    isDisabled={Boolean(focusedNodeContextPath) === false}
                    className={className}
                    icon="plus"
                    onClick={this.handleClick}
                    hoverStyle="clean"
                    />
            </span>
        );
    }
}
