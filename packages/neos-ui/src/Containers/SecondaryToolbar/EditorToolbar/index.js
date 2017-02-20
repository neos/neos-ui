import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$get, $transform} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';

import style from './style.css';
import {renderToolbarComponents} from './Helpers';
import {calculateEnabledFormattingRulesForNodeType} from '../../ContentCanvas/Helpers';

@connect($transform({
    focusedNode: selectors.CR.Nodes.focusedSelector,
    currentlyEditedPropertyName: selectors.UI.ContentCanvas.currentlyEditedPropertyName,
    formattingUnderCursor: selectors.UI.ContentCanvas.formattingUnderCursor,
    context: selectors.Guest.context
}))
@neos(globalRegistry => ({
    toolbarRegistry: globalRegistry.get('richtextToolbar'),
    formattingRulesRegistry: globalRegistry.get('@neos-project/neos-ui-ckeditor-bindings').get('formattingRules'),
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class Toolbar extends PureComponent {
    static propTypes = {
        focusedNode: PropTypes.object,
        currentlyEditedPropertyName: PropTypes.string,
        formattingUnderCursor: PropTypes.objectOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.bool
        ])),
        toolbarRegistry: PropTypes.object,
        formattingRulesRegistry: PropTypes.object,
        nodeTypesRegistry: PropTypes.object,

        // The current guest frames window object.
        context: PropTypes.object
    };

    constructor(...args) {
        super(...args);
        this.onToggleFormat = this.onToggleFormat.bind(this);
    }

    componentWillMount() {
        const {nodeTypesRegistry, formattingRulesRegistry, toolbarRegistry} = this.props;
        this.renderToolbarComponents = renderToolbarComponents(toolbarRegistry);
        this.calculateEnabledFormattingRulesForNodeType = calculateEnabledFormattingRulesForNodeType({
            nodeTypesRegistry,
            formattingRulesRegistry
        });
    }

    onToggleFormat(formattingRule) {
        const {context} = this.props;

        context.NeosCKEditorApi.toggleFormat(formattingRule);
    }

    render() {
        const {focusedNode, currentlyEditedPropertyName, formattingUnderCursor} = this.props;
        const enabledFormattingRuleIds = this.calculateEnabledFormattingRulesForNodeType($get('nodeType', focusedNode));
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
