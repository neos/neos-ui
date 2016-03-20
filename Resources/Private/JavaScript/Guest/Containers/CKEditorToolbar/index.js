import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$get} from 'plow-js';

import {
    Bold
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

        return (
            <div className={classNames} style={{top: y - 49, left: x - 9}}>
                <div className={style.toolBar__btnGroup}>
                    <Bold editor={editor} ckApi={ckApi} {...props} />
                </div>
            </div>
        );
    }
});

export default createCKEditorToolbar(window.CKEDITOR);
