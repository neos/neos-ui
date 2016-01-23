import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';
import {IconButton, Icon} from 'Host/Components/';
import {executeCallback} from 'Shared/Utilities/';

export default class FooterBar extends Component {
    static propTypes = {
        message: PropTypes.string.isRequired,
        severity: PropTypes.string.isRequired,
        timeout: PropTypes.number,
        onClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {isVisible: false};
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
        const onClick = e => executeCallback({
            e,
            cb: () => this.commenceClose()
        });

        return (
            <div className={flashMessageClasses}>
                <Icon icon={iconName} className={style.flashMessage__icon} />
                <div className={style.flashMessage__heading}>{message}</div>
                <IconButton
                    icon="close"
                    className={style.flashMessage__btnClose}
                    style="transparent"
                    hoverStyle="darken"
                    onClick={onClick}
                    />
            </div>
        );
    }

    componentDidMount() {
        const {timeout} = this.props;
        setTimeout(() => this.setState({isVisible: true}), 0);

        if (timeout) {
            setTimeout(() => this.onTimeout(), timeout);
        }
    }

    onTimeout() {
        this.commenceClose();
    }

    commenceClose() {
        const {onClose} = this.props;
        this.setState({isVisible: false});

        setTimeout(onClose, 100);
    }
}
