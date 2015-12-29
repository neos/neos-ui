import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Icon from '../Icon/';
import Button from '../Button/';
import style from './style.css';

@connect()
export default class IconButton extends Component {
    static propTypes = {
        icon: PropTypes.string.isRequired,
        onClick: PropTypes.func
    };

    render() {
        const {icon} = this.props;

        return (
            <Button className={style.iconButton} style="transparent" hoverStyle="brand" onClick={this.onClick.bind(this)}>
              <Icon icon={icon} />
            </Button>
        );
    }

    onClick() {
        const {onClick} = this.props;

        if (onClick) {
            onClick();
        }
    }
}
