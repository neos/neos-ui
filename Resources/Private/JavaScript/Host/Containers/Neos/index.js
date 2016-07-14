import {Component, PropTypes, Children} from 'react';

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

    getChildContext() {
        const {configuration, inspectorEditorRegistry, translations} = this.props;
        return {configuration, inspectorEditorRegistry, translations};
    }

    render() {
        return Children.only(this.props.children);
    }
}
