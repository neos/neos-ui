import React, {Component, PropTypes} from 'react';

import Button from '@neos-project/react-ui-components/lib/Button/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import Label from '@neos-project/react-ui-components/lib/Label/';
import I18n from '@neos-project/neos-ui-i18n';
import CodeMirrorWrap from './CodeMirrorWrap/index';

export default class CodeMirror extends Component {
    static propTypes = {
        identifier: PropTypes.string.isRequired,
        renderSecondaryInspector: PropTypes.func.isRequired,
        commit: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        highlightingMode: PropTypes.string,
        value: PropTypes.string
    };

    static defaultProps = {
        highlightingMode: 'htmlmixed'
    };

    constructor(props) {
        super(props);
        this.handleOpenCodeEditor = this.handleOpenCodeEditor.bind(this);
    }

    handleOpenCodeEditor() {
        this.props.renderSecondaryInspector('CODEMIRROR_EDIT', () =>
            <CodeMirrorWrap onChange={this.props.commit} value={this.props.value} highlightingMode={this.props.highlightingMode} />
        );
    }

    render() {
        const {label, identifier} = this.props;

        return (
            <div>
                <Label htmlFor={identifier}>
                    <Button onClick={this.handleOpenCodeEditor} style="brand">
                        <Icon icon="pencil" padded="right" style="lighter" title="Edit" />
                        <I18n id={label}/>
                    </Button>
                </Label>
            </div>
        );
    }
}
