import React from 'react';
import omit from 'lodash.omit';

import isToolbarItemVisible from './isToolbarItemVisible';
import isToolbarItemActive from './isToolbarItemActive';

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

    return (executeCommand, inlineEditorOptions, formattingUnderCursor) => {
        return toolbarComponents
            .filter(isTopLevelToolbarComponent && isToolbarItemVisible(inlineEditorOptions, formattingUnderCursor))
            .map((componentDefinition, index) => {
                const {component, commandName, commandArgs = [], callbackPropName, ...props} = componentDefinition;
                if (!component) {
                    return null;
                }
                const restProps = omit(props, ['isVisible', 'isActive']);
                const isActiveProp = isToolbarItemActive(formattingUnderCursor, inlineEditorOptions)(componentDefinition);

                const finalProps = {
                    ...restProps,
                    key: index,
                    isActive: isActiveProp,
                    inlineEditorOptions,
                    executeCommand,
                    formattingUnderCursor,
                    [callbackPropName]: e => e.stopPropagation() || executeCommand(commandName, ...commandArgs)
                };

                const Component = component;

                return <Component {...finalProps} />;
            });
    };
};
