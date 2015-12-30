import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Icon from '../Icon/';
import Button from '../Button/';
import style from './style.css';

@connect()
export default class IconButton extends Component {
    static propTypes = {
        icon: PropTypes.string.isRequired,
        className: PropTypes.string,
        onClick: PropTypes.func
    };

    render() {
        const {icon} = this.props;

        // Since `this.props` isnt writable, we need to clone it.
        // Add the component specific className to the passed props.
        const props = Object.assign({}, this.props, {
            className: `${this.props.className} ${style.iconButton}`
        });

        return (
            <Button {...props}>
              <Icon icon={icon} />
            </Button>
        );
    }
}
IconButton.defaultProps = {
    style: 'transparent',
    hoverStyle: 'brand'
};
