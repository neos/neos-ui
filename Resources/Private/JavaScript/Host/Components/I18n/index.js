import React, {Component, PropTypes} from 'react';
import {backend} from '../../Service/';

export default class I18n extends Component {
    static propTypes = {
        fallback: PropTypes.string.isRequired,
        className: PropTypes.string,

        id: PropTypes.string,
        packageKey: PropTypes.string.isRequired,
        sourceName: PropTypes.string.isRequired,
        params: PropTypes.array.isRequired
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
        if (newProps.fallback !== this.props.fallback) {
            this.loadTranslation(newProps);
        }
    }

    loadTranslation(props = this.props) {
        const {fallback, id, packageKey, sourceName, params} = props;
        const {i18n} = backend;
        const label = i18n && id ? i18n(id, packageKey, sourceName, params) : fallback;

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
