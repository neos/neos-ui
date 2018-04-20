import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import Icon from '@neos-project/react-ui-components/src/Icon/';

import style from './style.css';

export default class FlashMessage extends PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        severity: PropTypes.string.isRequired,
        timeout: PropTypes.number,
        onClose: PropTypes.func.isRequired
    };

    handleClose = () => {
        const {onClose, id} = this.props;

        setTimeout(() => onClose(id), 100);
    }

    componentDidMount() {
        const {timeout} = this.props;

        if (timeout) {
            setTimeout(this.handleClose, timeout);
        }
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
            [style['flashMessage--info']]: isInfo
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
                    icon="times"
                    className={style.flashMessage__btnClose}
                    style="transparent"
                    hoverStyle="darken"
                    onClick={this.handleClose}
                    />
            </div>
        );
    }
}
