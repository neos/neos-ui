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

        this.state = {label: 'Translation loading...'};
    }

    render() {
        return (
            <span className={this.props.className}>{this.state.label}</span>
        );
    }

    componentDidMount() {
        this.loadTranslation();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.target !== this.props.target) {
            this.loadTranslation(newProps);
        }
    }

    loadTranslation(props = this.props) {
        const {target} = props;

        logger.info('translate key: ', target, props);

        this.setState({label: target});
    }
}
