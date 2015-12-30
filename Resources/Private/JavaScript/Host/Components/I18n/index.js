import React, {Component, PropTypes} from 'react';
import {service} from '../../../Shared/';
const {logger} = service;

export default class I18n extends Component {
    static propTypes = {
        target: PropTypes.string,
        className: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.state = {label: ''};
    }

    render() {
        return (
            <span className={this.props.className}>{this.state.label}</span>
        );
    }

    componentWillReceiveProps(newProps) {
      const {target} = newProps;

      logger.info('translate key: ', target, newProps);

      this.setState({label: target});
    }
}
