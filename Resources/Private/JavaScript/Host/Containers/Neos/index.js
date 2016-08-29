import {Component, PropTypes, Children} from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export default class Neos extends Component {
    static propTypes = {
        translations: PropTypes.object.isRequired,
        configuration: PropTypes.object.isRequired,
        inspectorEditorRegistry: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired
    };

    static childContextTypes = {
        translations: PropTypes.object.isRequired,
        configuration: PropTypes.object.isRequired,
        inspectorEditorRegistry: PropTypes.object.isRequired
    };

    shouldComponentUpdate(...args) {
        //
        // ToDo: Revisit later, shallow compare may not be suitable for these nested objects
        //
        return shallowCompare(this, ...args);
    }

    getChildContext() {
        const {configuration, inspectorEditorRegistry, translations} = this.props;
        return {configuration, inspectorEditorRegistry, translations};
    }

    render() {
        return Children.only(this.props.children);
    }
}
