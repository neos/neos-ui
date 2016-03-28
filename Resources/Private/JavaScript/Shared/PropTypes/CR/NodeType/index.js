import {PropTypes} from 'react';

const propertyDefinition = PropTypes.shape({
    type: PropTypes.string.isRequired,
    ui: PropTypes.shape({
        label: PropTypes.string,
        help: PropTypes.shape({
            message: PropTypes.string.isRequired
        }),
        reloadIfChanged: PropTypes.bool,
        reloadPageIfChanged: PropTypes.bool,
        inlineEditable: PropTypes.bool,
        aloha: PropTypes.shape({
            format: PropTypes.shape({
                strong: PropTypes.bool,
                b: PropTypes.bool,
                em: PropTypes.bool,
                i: PropTypes.bool,
                u: PropTypes.bool,
                del: PropTypes.bool,
                sub: PropTypes.bool,
                sup: PropTypes.bool,
                p: PropTypes.bool,
                h1: PropTypes.bool,
                h2: PropTypes.bool,
                h3: PropTypes.bool,
                h4: PropTypes.bool,
                h5: PropTypes.bool,
                h6: PropTypes.bool,
                pre: PropTypes.bool,
                removeFormat: PropTypes.bool
            }),
            table: PropTypes.shape({
                table: PropTypes.bool
            }),
            link: PropTypes.shape({
                a: PropTypes.bool
            }),
            list: PropTypes.shape({
                ol: PropTypes.bool,
                ul: PropTypes.bool
            }),
            alignment: PropTypes.shape({
                right: PropTypes.bool,
                left: PropTypes.bool,
                center: PropTypes.bool,
                justify: PropTypes.bool,
                top: PropTypes.bool,
                middle: PropTypes.bool,
                bottom: PropTypes.bool
            }),
            formatlesspaste: PropTypes.shape({
                button: PropTypes.bool,
                formatlessPasteOption: PropTypes.bool,
                strippedElements: PropTypes.arrayOf(
                    PropTypes.string
                )
            }),
            autoparagraph: PropTypes.bool,
            placeholder: PropTypes.string
        }),
        inspector: PropTypes.shape({
            group: PropTypes.string,
            position: PropTypes.number,
            editor: PropTypes.string,
            editorOptions: PropTypes.object,
            editorListeners: PropTypes.shape({
                property: PropTypes.string.isRequired,
                handler: PropTypes.string.isRequired,
                handlerOptions: PropTypes.object
            })
        })
    })
});

export const nodeType = PropTypes.shape({
    constraints: PropTypes.shape({
        nodeTypes: PropTypes.object.isRequired
    }),
    label: PropTypes.string.isRequired,
    properties: PropTypes.objectOf(propertyDefinition).isRequired,
    superTypes: PropTypes.objectOf(PropTypes.boolean),
    ui: PropTypes.shape({
        label: PropTypes.string,
        help: PropTypes.object,
        icon: PropTypes.string,
        group: PropTypes.string,
        position: PropTypes.number,
        inspector: PropTypes.shape({
            tabs: PropTypes.shape({
                label: PropTypes.string.isRequired,
                icon: PropTypes.string.isRequired,
                position: PropTypes.number
            }),
            groups: PropTypes.shape({
                label: PropTypes.string.isRequired,
                tab: PropTypes.string.isRequired,
                position: PropTypes.number,
                collapsed: PropTypes.bool
            }),
            views: PropTypes.shape({
                label: PropTypes.string.isRequired,
                group: PropTypes.string.isRequired,
                view: PropTypes.string.isRequired,
                position: PropTypes.number
            })
        }),
        search: PropTypes.shape({
            searchCategory: PropTypes.string
        })
    })
});
