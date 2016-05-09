import React, {Component, PropTypes, Children} from 'react';

export default class Neos extends Component {
    static propTypes = {
        configuration: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired
    };

    static childContextTypes = {
        configuration: PropTypes.object.isRequired
    };

    getChildContext() {
        const {configuration} = this.props;
        return {configuration};
    }

    render() {
        return Children.only(this.props.children);
    }
}
