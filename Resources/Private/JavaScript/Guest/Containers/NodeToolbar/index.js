import React, {Component, PropTypes} from 'react';

import {position} from 'Guest/Process/DOMUtils.js';

import {
    AddNode,
    CopySelectedNode,
    CutSelectedNode,
    DeleteSelectedNode,
    HideSelectedNode,
    PasteClipBoardNode
} from './Buttons/index';
import style from './style.css';

export default class NodeToolbar extends Component {
    static propTypes = {
        ui: PropTypes.object.isRequired,
        connection: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        const {connection} = props;

        this.state = {
            top: 0,
            left: 0,
            isVisible: false
        };

        connection.observe('nodes.focused').react(({node, typoscriptPath}) => {
            if (node && typoscriptPath) {
                const dom = document.querySelector(
                    `[data-__che-typoscript-path="${typoscriptPath}"][data-__che-node-contextpath="${node.contextPath}"]`
                );
                const {x, y} = position(dom);

                this.setState({
                    left: x - 9,
                    top: y - 49,
                    isVisible: true
                });
            } else {
                this.setState({isVisible: false});
            }
        });
    }

    render() {
        const props = {
            className: style.toolBar__btnGroup__btn
        };
        const {top, left, isVisible} = this.state;

        return (
            <div
                className={style.toolBar}
                style={{top, left, display: isVisible ? 'block' : 'none'}}
                >
                <div className={style.toolBar__btnGroup}>
                    <AddNode {...props} />
                    <HideSelectedNode {...props} />
                    <CopySelectedNode {...props} />
                    <CutSelectedNode {...props} />
                    <PasteClipBoardNode {...props} />
                    <DeleteSelectedNode {...props} />
                </div>
            </div>
        );
    }
}
