import {PureComponent, PropTypes, Children} from 'react';

export default class Neos extends PureComponent {
    static propTypes = {
        globalRegistry: PropTypes.object.isRequired,
        configuration: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired
    };

    static childContextTypes = {
        globalRegistry: PropTypes.object.isRequired,
        configuration: PropTypes.object.isRequired
    };

    getChildContext() {
        const {configuration, globalRegistry} = this.props;
        return {configuration, globalRegistry};
    }

    render() {
        return Children.only(this.props.children);
    }
}
