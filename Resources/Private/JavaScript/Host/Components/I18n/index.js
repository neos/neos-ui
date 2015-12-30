import React, {Component, PropTypes} from 'react';
import {backend} from '../../Service/';

export default class I18n extends Component {
    static propTypes = {
        target: PropTypes.string.isRequired,
        className: PropTypes.string,

        id: PropTypes.string.isRequired,
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
        if (newProps.target !== this.props.target) {
            this.loadTranslation(newProps);
        }
    }

    loadTranslation(props = this.props) {
        const {target, id, packageKey, sourceName, params} = props;
        const {i18n} = backend;

        if (i18n) {
            const label = id ? i18n(id, packageKey, sourceName, params) : target;
            this.setState({
                label
            });
        } else if (target) {
            this.setState({label: target});
        }
    }
}
I18n.defaultProps = {
    packageKey: 'TYPO3.Neos',
    sourceName: 'Main',
    params: []
};
