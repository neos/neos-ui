import React, {PureComponent, PropTypes} from 'react';
import mergeClassNames from 'classnames';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import style from './style.css';

export default class RefreshPageTree extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        isLoading: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {onClick} = this.props;

        onClick();
    }

    render() {
        const {isLoading, className, ...rest} = this.props;
        const finalClassName = mergeClassNames({
            [style.spinning]: isLoading,
            [className]: className && className.length
        });

        return (
            <IconButton
                {...rest}
                className={finalClassName}
                isDisabled={isLoading}
                onClick={this.handleClick}
                icon="refresh"
                hoverStyle="clean"
                />
        );
    }
}
