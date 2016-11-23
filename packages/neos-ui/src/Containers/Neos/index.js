import {PureComponent, PropTypes, Children} from 'react';

export default class Neos extends PureComponent {
    static propTypes = {
        globalRegistry: PropTypes.object.isRequired,
        translations: PropTypes.object.isRequired,
        configuration: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired
    };

    static childContextTypes = {
        translations: PropTypes.object.isRequired,
        globalRegistry: PropTypes.object.isRequired,
        configuration: PropTypes.object.isRequired
    };

    getChildContext() {
        const {configuration, translations, globalRegistry} = this.props;
        return {configuration, translations, globalRegistry};
    }

    render() {
        return Children.only(this.props.children);
    }
}
