import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import Icon from '@neos-project/react-ui-components/lib/Icon/';
import Button from '@neos-project/react-ui-components/lib/Button/';

import I18n from '@neos-project/neos-ui-i18n';

import style from '../style.css';

export default class MenuItem extends Component {
    static propTypes = {
        icon: PropTypes.string,
        label: PropTypes.string.isRequired,
        uri: PropTypes.string.isRequired,
        target: PropTypes.string,
        isActive: PropTypes.bool.isRequired,

        onClick: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.handleClick = ::this.handleClick;
    }

    shouldComponentUpdate(nextProps) {
        return shallowCompare(this.props, nextProps);
    }

    handleClick() {
        const {uri, target, onClick} = this.props;

        onClick(target, uri);
    }

    render() {
        const {label, icon} = this.props;

        return (
            <Button
                className={style.drawer__menuItemBtn}
                onClick={this.handleClick}
                style="transparent"
                >
                {icon && <Icon icon={icon} padded="right"/>}

                <I18n id={label} fallback={label}/>
            </Button>
        );
    }
}
