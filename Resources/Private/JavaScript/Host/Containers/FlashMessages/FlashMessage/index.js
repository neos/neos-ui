import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import mergeClassNames from 'classnames';

import {IconButton, Icon} from 'Components/index';

import style from './style.css';

export default class FlashMessage extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        severity: PropTypes.string.isRequired,
        timeout: PropTypes.number,
        onClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {isVisible: false};
        this.handleCloseClick = this.commenceClose.bind(this);
    }

    shouldComponentUpdate(newProps, newState) {
        return shallowCompare(this, newProps, newState);
    }

    render() {
        const {message, severity} = this.props;
        const isSuccess = severity === 'success';
        const isError = severity === 'error';
        const isInfo = severity === 'info';

        const flashMessageClasses = mergeClassNames({
            [style.flashMessage]: true,
            [style['flashMessage--success']]: isSuccess,
            [style['flashMessage--error']]: isError,
            [style['flashMessage--info']]: isInfo,
            [style['flashMessage--visible']]: this.state.isVisible
        });

        const iconName = mergeClassNames({
            check: isSuccess,
            ban: isError,
            info: isInfo
        }) || 'info';

        return (
            <div className={flashMessageClasses} role="alert">
                <Icon icon={iconName} className={style.flashMessage__icon}/>
                <div className={style.flashMessage__heading}>{message}</div>
                <IconButton
                    icon="close"
                    className={style.flashMessage__btnClose}
                    style="transparent"
                    hoverStyle="darken"
                    onClick={this.handleCloseClick}
                    />
            </div>
        );
    }

    componentDidMount() {
        const {timeout} = this.props;
        setTimeout(() => this.setState({isVisible: true}), 0);

        if (timeout) {
            setTimeout(() => this.commenceClose(), timeout);
        }
    }

    commenceClose() {
        const {onClose, id} = this.props;
        this.setState({isVisible: false});

        setTimeout(() => onClose(id), 100);
    }
}
