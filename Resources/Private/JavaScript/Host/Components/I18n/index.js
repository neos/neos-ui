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

    componentDidMount() {
        this.getTranslation();
    }

    getTranslation() {
        const {target} = this.props;

        logger.info('translate key: ', target, this.props);

        this.setState({label: target});

        return target;
    }
}
