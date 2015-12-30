import React, {Component, PropTypes} from 'react';
import {service} from '../../../Shared/';
const {logger} = service;

import {backend} from '../../Service/';

export default class I18n extends Component {
    static propTypes = {
        target: PropTypes.string,
        className: PropTypes.string,

        id: PropTypes.string,
        packageKey: PropTypes.string,
        sourceName: PropTypes.string,
        params: PropTypes.array
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
        const {target, id, packageKey, sourceName, params} = props;
        const {i18n} = backend;

        if (i18n) {
            this.setState({label: id ? i18n(id, packageKey || 'TYPO3.Neos', sourceName || 'Main', params || []) : target});
        } else if (target) {
            this.setState({label: target});
        }
    }
}
