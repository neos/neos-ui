import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$get} from 'plow-js';

import {
    Bold,
    Italic,
    Underline,
    SubScript,
    SuperScript,
    StrikeThrough,
    OrderedList,
    UnorderedList,
    AlignRight,
    AlignLeft,
    AlignCenter,
    AlignJustify,
    FormatDropDown
} from './Subcomponents/index';
import style from './style.css';

//
// Export factory for CKEDITOR API injection
//
export const createCKEditorToolbar = ckApi => (
@connect($get('ckEditorToolbar'))
class CKEditorToolbar extends Component {
    static propTypes = {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        isVisible: PropTypes.bool.isRequired,
        editorName: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.removeEditorListener = null;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.editorName !== nextProps.editorName) {
            if (this.removeEditorListener) {
                this.removeEditorListener();
            }

            const editor = ckApi.instances[nextProps.editorName];

            if (editor) {
                const {removeListener} = editor.on('change', () => {
                    this.setState(this.state);
                });

                this.removeEditorListener = removeListener;
            }
        }
    }

    render() {
        const props = {
            className: style.toolBar__btnGroup__btn
        };
        const {x, y, isVisible, editorName} = this.props;
        const editor = ckApi.instances[editorName];
        const classNames = mergeClassNames({
            [style.toolBar]: true,
            [style['toolBar--isHidden']]: !isVisible
        });

        return editor ? (
            <div className={classNames} style={{top: y - 49, left: x - 9}}>
                <div className={style.toolBar__btnGroup}>
                    <FormatDropDown editor={editor} ckApi={ckApi} />
                    <Bold editor={editor} ckApi={ckApi} {...props} />
                    <Italic editor={editor} ckApi={ckApi} {...props} />
                    <Underline editor={editor} ckApi={ckApi} {...props} />
                    <SubScript editor={editor} ckApi={ckApi} {...props} />
                    <SuperScript editor={editor} ckApi={ckApi} {...props} />
                    <StrikeThrough editor={editor} ckApi={ckApi} {...props} />
                    <OrderedList editor={editor} ckApi={ckApi} {...props} />
                    <UnorderedList editor={editor} ckApi={ckApi} {...props} />
                    <AlignRight editor={editor} ckApi={ckApi} {...props} />
                    <AlignLeft editor={editor} ckApi={ckApi} {...props} />
                    <AlignCenter editor={editor} ckApi={ckApi} {...props} />
                    <AlignJustify editor={editor} ckApi={ckApi} {...props} />
                </div>
            </div>
        ) : null;
    }
});

export default createCKEditorToolbar(window.CKEDITOR);
