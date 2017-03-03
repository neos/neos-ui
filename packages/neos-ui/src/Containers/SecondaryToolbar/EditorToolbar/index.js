import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';

import style from './style.css';
import {renderToolbarComponents} from './Helpers/index';
import {calculateEnabledFormattingRulesForNodeTypeFactory} from '../../ContentCanvas/Helpers/index';

@connect($transform({
    focusedNodeType: selectors.CR.Nodes.focusedNodeTypeSelector,
    currentlyEditedPropertyName: selectors.UI.ContentCanvas.currentlyEditedPropertyName,
    formattingUnderCursor: selectors.UI.ContentCanvas.formattingUnderCursor,
    context: selectors.Guest.context
}))
@neos(globalRegistry => ({
    globalRegistry,
    toolbarRegistry: globalRegistry.get('richtextToolbar')
}))
export default class EditorToolbar extends PureComponent {
    static propTypes = {
        focusedNodeType: PropTypes.string,
        currentlyEditedPropertyName: PropTypes.string,
        formattingUnderCursor: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.bool,
            PropTypes.object
        ])),
        // The current guest frames window object.
        context: PropTypes.object,

        globalRegistry: PropTypes.object.isRequired,
        toolbarRegistry: PropTypes.object.isRequired
    };

    constructor(...args) {
        super(...args);
        this.onToggleFormat = this.onToggleFormat.bind(this);
    }

    componentWillMount() {
        const {toolbarRegistry} = this.props;
        this.renderToolbarComponents = renderToolbarComponents(toolbarRegistry);
    }

    onToggleFormat(formattingRule) {
        const {context} = this.props;

        context.NeosCKEditorApi.toggleFormat(formattingRule);
    }

    render() {
        const {focusedNodeType, currentlyEditedPropertyName, formattingUnderCursor, globalRegistry} = this.props;
        const calculateEnabledFormattingRulesForNodeType = calculateEnabledFormattingRulesForNodeTypeFactory(globalRegistry);
        const enabledFormattingRuleIds = calculateEnabledFormattingRulesForNodeType(focusedNodeType);
        const classNames = mergeClassNames({
            [style.toolBar]: true
        });
        const renderedToolbarComponents = this.renderToolbarComponents(
            this.onToggleFormat,
            enabledFormattingRuleIds[currentlyEditedPropertyName] || [],
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
