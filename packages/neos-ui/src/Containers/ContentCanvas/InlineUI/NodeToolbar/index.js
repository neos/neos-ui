import React, {PureComponent, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import debounce from 'lodash.debounce';

import {dom} from '../../Helpers/index';

import {
    AddNode,
    CopySelectedNode,
    CutSelectedNode,
    DeleteSelectedNode,
    HideSelectedNode,
    PasteClipBoardNode
} from './Buttons/index';
import style from './style.css';

export const position = (contextPath, fusionPath) => {
    const nodeElement = dom.findNode(contextPath, fusionPath);

    if (nodeElement && nodeElement.getBoundingClientRect) {
        const bodyBounds = dom.body().getBoundingClientRect();
        const domBounds = nodeElement.getBoundingClientRect();

        return {
            top: domBounds.top - bodyBounds.top,
            right: bodyBounds.right - domBounds.right
        };
    }

    return {top: 0, right: 0};
};

export default class NodeToolbar extends PureComponent {
    static propTypes = {
        contextPath: PropTypes.string,
        fusionPath: PropTypes.string
    };

    componentDidMount() {
        const iframeWindow = document.getElementsByName('neos-content-main')[0].contentWindow;

        iframeWindow.addEventListener('resize', debounce(() => this.forceUpdate(), 20));
    }

    render() {
        const {contextPath, fusionPath} = this.props;

        if (!contextPath || !fusionPath) {
            return null;
        }

        const props = {
            contextPath,
            fusionPath,
            className: style.toolBar__btnGroup__btn
        };

        const {top, right} = position(contextPath, fusionPath);

        const classNames = mergeClassNames({
            [style.toolBar]: true
        });

        return (
            <div className={classNames} style={{top: top - 50, right}}>
                <div className={style.toolBar__btnGroup}>
                    <AddNode {...props}/>
                    <HideSelectedNode {...props}/>
                    <CopySelectedNode {...props}/>
                    <CutSelectedNode {...props}/>
                    <PasteClipBoardNode {...props}/>
                    <DeleteSelectedNode {...props}/>
                </div>
            </div>
        );
    }
}
