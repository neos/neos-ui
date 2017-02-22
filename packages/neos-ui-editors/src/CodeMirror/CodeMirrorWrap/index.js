import React, {PureComponent, PropTypes} from 'react';
import CodeMirror from 'react-codemirror';

// TODO: Find way to dynamically load any mode?
/* eslint-disable no-unused-vars */
import XmlMode from 'codemirror/mode/xml/xml';
import HtmlMixedMode from 'codemirror/mode/htmlmixed/htmlmixed';
import JavascriptMode from 'codemirror/mode/javascript/javascript';
import HandlebarsMode from 'codemirror/mode/handlebars/handlebars';
import MarkdownMode from 'codemirror/mode/markdown/markdown';
import YamlMode from 'codemirror/mode/yaml/yaml';
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
            <CodeMirror value={this.props.value} onChange={this.handleChange} options={options}/>
        );
    }

    handleChange(newValue) {
        this.props.onChange(newValue);
    }
}
