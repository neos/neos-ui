import React, {Component, PropTypes} from 'react';
import {backend} from 'Host/Service/';

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
        if (newProps.fallback !== this.props.fallback) {
            this.loadTranslation(newProps);
        }
    }

    splitIdentifier(id, packageKey, sourceName) {
        if (id && id.split) {
            const idParts = id.split(':', 3);
            switch (idParts.length) {
                case 2:
                    packageKey = idParts[0];
                    id = idParts[1];
                    break;
                case 3:
                    packageKey = idParts[0];
                    sourceName = idParts[1];
                    id = idParts[2];
                    break;
                default:
                    break;
            }
        }
        return {id, packageKey, sourceName};
    }

    loadTranslation(props = this.props) {
        const {
            id,
            packageKey,
            sourceName,
            fallback,
            params
        } = props;
        const {i18n} = backend;
        const splitedId = this.splitIdentifier(id, packageKey, sourceName);
        const label = i18n && id ? i18n(splitedId.id, splitedId.packageKey, splitedId.sourceName, params) : fallback;

        this.setState({
            label
        });
    }
}
I18n.defaultProps = {
    packageKey: 'TYPO3.Neos',
    sourceName: 'Main',
    params: []
};
