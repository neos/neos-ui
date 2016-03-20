import React, {Component, PropTypes} from 'react';
import {backend} from 'Host/Service/index';

export default class I18n extends Component {
    static propTypes = {
        // Fallback key which gets rendered once the i18n service doesn't return a translation.
        fallback: PropTypes.string.isRequired,

        // The target id which the i18n service accepts.
        id: PropTypes.string,

        // The destination paths for the package and source of the translation.
        packageKey: PropTypes.string.isRequired,
        sourceName: PropTypes.string.isRequired,

        // Additional parameters which are passed to the i18n service.
        params: PropTypes.array.isRequired,

        // Optional className which gets added to the translation span.
        className: PropTypes.string
    };

    static defaultProps = {
        packageKey: 'TYPO3.Neos',
        sourceName: 'Main',
        params: []
    };

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
        if (newProps.id !== this.props.id) {
            this.loadTranslation(newProps);
        }
    }

    loadTranslation(props = this.props) {
        const {
            fallback,
            id,
            packageKey,
            sourceName,
            params
        } = props;
        const {i18n} = backend;
        const label = i18n && id && i18n(id, packageKey, sourceName, params);

        this.setState({
            label: label ? label : fallback
        });
    }
}
