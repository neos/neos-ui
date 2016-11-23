import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';
import omit from 'lodash.omit';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import style from './style.css';

@connect(state => ({
    isLoading: selectors.UI.PageTree.getIsLoading(state)
}), {
    onClick: actions.UI.PageTree.reloadTree
})
export default class RefreshPageTree extends Component {
    static propTypes = {
        nodeTypesRegistry: PropTypes.object.isRequired,
        onClick: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        className: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.handleClick = () => this.props.onClick(this.props.nodeTypesRegistry);
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {isLoading, className, ...restProps} = this.props;
        const finalClassName = mergeClassNames({
            [style.spinning]: isLoading,
            [className]: className && className.length
        });
        const rest = omit(restProps, ['nodeTypesRegistry']);

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
