import React from 'react';
import {$get} from 'plow-js';
import omit from 'lodash.omit';

import hideDisallowedToolbarComponents from './hideDisallowedToolbarComponents';

//
// A component is top-level if it does not contain slashes in the name.
//
const isTopLevelToolbarComponent = componentDefinition =>
    componentDefinition.id.indexOf('/') === -1;

/**
* Render sub components for the toolbar, implementing the API as described in
* the `richtextToolbar` registry.
*/
export default richtextToolbarRegistry => {
    const toolbarComponents = richtextToolbarRegistry.getAllAsList();

    return (onToggleFormat, inlineEditorOptions, formattingUnderCursor) => {
        return toolbarComponents
            // ToDo: Why chain two filter methods after each other? Can't we combine them into one to reduce unnecessary iterations?
            .filter(isTopLevelToolbarComponent)
            .filter(hideDisallowedToolbarComponents(inlineEditorOptions, formattingUnderCursor))
            .map((componentDefinition, index) => {
                const {component, formattingRule, callbackPropName, ...props} = componentDefinition;
                const restProps = omit(props, ['isVisibleWhen']);
                const isActive = formattingRule && (
                    $get([formattingRule], formattingUnderCursor) === true ||
                    $get([formattingRule], formattingUnderCursor) === richtextToolbarRegistry.TRISTATE_ON
                );

                const finalProps = {
                    ...restProps,
                    formattingRule,
                    [callbackPropName]: () => onToggleFormat(formattingRule)
                };

                const Component = component;

                return <Component key={index} isActive={isActive} {...finalProps}/>;
            });
    };
};
