import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Icon from 'Host/Components/Icon/';
import Button from 'Host/Components/Button/';
import style from './style.css';

@connect()
export default class IconButton extends Component {
    static propTypes = {
        // The icon key which gets passed to the Icon Component.
        icon: PropTypes.string.isRequired,

        // Additional className for the Button.
        className: PropTypes.string
    };

    render() {
        // Since `this.props` isn't writable, we need to clone it
        // and add the component specific className to the passed props.
        const props = Object.assign({}, this.props, {
            className: `${this.props.className} ${style.iconButton}`
        });

        return (
            <Button {...props}>
              <Icon icon={this.props.icon} />
            </Button>
        );
    }
}
IconButton.defaultProps = {
    style: 'transparent',
    hoverStyle: 'brand'
};
