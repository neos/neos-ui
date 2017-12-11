import {PureComponent, Children} from 'react';
import PropTypes from 'prop-types';

export default class Neos extends PureComponent {
    static propTypes = {
        globalRegistry: PropTypes.object.isRequired,
        configuration: PropTypes.object.isRequired,
        routes: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired
    };

    static childContextTypes = {
        globalRegistry: PropTypes.object.isRequired,
        configuration: PropTypes.object.isRequired,
        routes: PropTypes.object.isRequired
    };

    getChildContext() {
        const {configuration, globalRegistry, routes} = this.props;
        return {configuration, globalRegistry, routes};
    }

    render() {
        return Children.only(this.props.children);
    }
}
