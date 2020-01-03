import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

import {neos} from '@neos-project/neos-ui-decorators';

import style from './index.css';
import {renderToolbarComponents} from './Helpers/index';

@neos(globalRegistry => ({
    toolbarRegistry: globalRegistry.get('ckEditor5').get('richtextToolbar')
}))
export default class EditorToolbar extends PureComponent {
    static propTypes = {
        formattingUnderCursor: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.bool,
            PropTypes.object,
            PropTypes.string
        ])),
        toolbarRegistry: PropTypes.object.isRequired,
        editorOptions: PropTypes.object.isRequired,
        executeCommand: PropTypes.func.isRequired
    };

    UNSAFE_componentWillMount() {
        const {toolbarRegistry} = this.props;
        this.renderToolbarComponents = renderToolbarComponents(toolbarRegistry);
    }

    render() {
        const {
            formattingUnderCursor,
            editorOptions,
            executeCommand
        } = this.props;

        const classNames = mergeClassNames({
            [style.toolBar]: true
        });
        const renderedToolbarComponents = this.renderToolbarComponents(
            executeCommand,
            editorOptions,
            formattingUnderCursor
        );

        return (
            <div className={classNames}>
                <div className={style.toolBar__btnGroup}>
                    {renderedToolbarComponents}
                </div>
            </div>
        );
    }
}
