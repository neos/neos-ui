import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Icon from '@neos-project/react-ui-components/src/Icon/';
import Button from '@neos-project/react-ui-components/src/Button/';

import I18n from '@neos-project/neos-ui-i18n';

import style from '../style.css';
import {TARGET_WINDOW} from '../constants';

export default class MenuItem extends PureComponent {
    static propTypes = {
        icon: PropTypes.string,
        label: PropTypes.string.isRequired,
        uri: PropTypes.string,
        target: PropTypes.string,
        isActive: PropTypes.bool.isRequired,
        skipI18n: PropTypes.bool,

        onClick: PropTypes.func.isRequired
    };

    handleClick = () => {
        const {uri, target, onClick} = this.props;

        onClick(target, uri);
    }

    render() {
        const {skipI18n, label, icon, uri, target} = this.props;

        const button = (
            <Button
                className={style.drawer__menuItemBtn}
                onClick={this.handleClick}
                style="transparent"
                hoverStyle="clean"
                disabled={!uri}
                >
                {icon && <Icon icon={icon} size="1x" padded="right"/>}
                {skipI18n ? label : <I18n id={label} fallback={label}/>}
            </Button>
        );

        if (target === TARGET_WINDOW) {
            return <a href={uri}>{button}</a>;
        }
        return button;
    }
}
