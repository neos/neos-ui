import React, {PureComponent} from 'react';
import DecoupledEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';
import debounce from 'lodash.debounce';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';
import {EditorToolbar} from '@neos-project/neos-ui-ckeditor5-bindings/src/EditorToolbar';
import style from './index.css';

@neos(globalRegistry => ({
    globalRegistry,
    configRegistry: globalRegistry
        .get('ckEditor5')
        .get('config')
}))
@connect($transform({
    userPreferences: $get('user.preferences')
}))
export default class CKEditorWrap extends PureComponent {
    state = {
        formattingUnderCursor: {}
    }

    editorRef = React.createRef();

    editor = null;

    lastFormattingUnderCursorSerialized = ''

    executeCommand = (command, argument, reFocusEditor = true) => {
        this.editor.execute(command, argument);
        if (reFocusEditor) {
            this.editor.editing.view.focus();
        }
    };

    handleUserInteractionCallback = () => {
        if (!this.editor) {
            return;
        }
        const formattingUnderCursor = {};
        [...this.editor.commands].forEach(commandTuple => {
            const [commandName, command] = commandTuple;
            if (command.value !== undefined) {
                formattingUnderCursor[commandName] = command.value;
            }
        });

        const formattingUnderCursorSerialized = JSON.stringify(formattingUnderCursor);
        if (formattingUnderCursorSerialized !== this.lastFormattingUnderCursorSerialized) {
            this.setState({formattingUnderCursor});
            this.lastFormattingUnderCursorSerialized = formattingUnderCursorSerialized;
        }
    };

    componentDidMount() {
        const domNode = this.editorRef.current;
        const {onChange, value, options, userPreferences, configRegistry, globalRegistry} = this.props;

        const ckeConfig = configRegistry.getCkeditorConfig({
            editorOptions: options,
            userPreferences,
            globalRegistry,
            propertyDomNode: domNode
        });

        DecoupledEditor
            .create(domNode, {
                ...ckeConfig,
                initialData: value
            })
            .then(editor => {
                this.editor = editor;

                editor.model.document.on('change', () => this.handleUserInteractionCallback());
                editor.model.document.on('change:data', debounce(() => onChange(editor.getData()), 200, {maxWait: 3000}));
            }).catch(e => console.error(e));
    }

    render() {
        return (
            <div className={style.wrap}>
                <div className={style.toolBar__wrap}>
                    <EditorToolbar
                        executeCommand={this.executeCommand}
                        editorOptions={this.props.options}
                        formattingUnderCursor={this.state.formattingUnderCursor}
                    />
                </div>
                <div ref={this.editorRef} className={style.editor} />
            </div>
        );
    }
}
