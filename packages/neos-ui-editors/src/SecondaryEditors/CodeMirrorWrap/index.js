import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'react-codemirror';

// TODO: Find way to dynamically load any mode?
/* eslint-disable no-unused-vars */
import XmlMode from 'codemirror/mode/xml/xml';
import HtmlMixedMode from 'codemirror/mode/htmlmixed/htmlmixed';
import JavascriptMode from 'codemirror/mode/javascript/javascript';
import HandlebarsMode from 'codemirror/mode/handlebars/handlebars';
import MarkdownMode from 'codemirror/mode/markdown/markdown';
import YamlMode from 'codemirror/mode/yaml/yaml';
import Styles from './codemirror.vanilla-css';
import ThemeStyles from './codemirror-twilight.vanilla-css';
/* eslint-enable no-unused-vars */

export default class CodeMirrorWrap extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        highlightingMode: PropTypes.string.isRequired,
        value: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    editorRefCallback = ref => {
        if (!ref) {
            return;
        }
        const codeMirrorRef = ref.getCodeMirror();
        const codeMirrorWrapperDomElement = codeMirrorRef.display.wrapper;
        const offsetTop = codeMirrorWrapperDomElement.getBoundingClientRect().top;
        const clientHeight = window.innerHeight || document.clientHeight || document.getElementByTagName('body').clientHeight;
        const height = clientHeight - offsetTop;
        codeMirrorRef.setSize(null, height);
    }

    render() {
        const options = {
            mode: this.props.highlightingMode,
            theme: 'twilight',
            indentWithTabs: true,
            styleActiveLine: true,
            lineNumbers: true,
            lineWrapping: true
        };

        return (
            <CodeMirror value={this.props.value} onChange={this.handleChange} options={options} ref={this.editorRefCallback}/>
        );
    }

    handleChange(newValue) {
        this.props.onChange(newValue);
    }
}
