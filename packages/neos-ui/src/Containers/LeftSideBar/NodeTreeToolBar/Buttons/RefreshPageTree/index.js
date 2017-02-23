import React, {PureComponent, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import style from './style.css';

@connect(state => ({
    isLoading: selectors.UI.PageTree.getIsLoading(state)
}), {
    onClick: actions.UI.PageTree.reloadTree
})
export default class RefreshPageTree extends PureComponent {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        className: PropTypes.string
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
