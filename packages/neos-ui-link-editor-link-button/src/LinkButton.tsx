import * as React from 'react';

import {IconButton} from '@neos-project/react-ui-components';

import {useEditorTransactions} from '@neos-project/neos-ui-link-editor-core';
import {useI18n} from '@neos-project/neos-ui-link-editor-neos-bridge';
import { ILinkOptions } from '@neos-project/neos-ui-link-editor-core/src/domain';

interface Props {
    inlineEditorOptions?: {
        linking?: {
            anchor?: boolean
            title?: boolean
            relNofollow?: boolean
            targetBlank?: boolean
            startingPoint?: string
            'Sitegeist.Archaeopteryx'?: {
                linkTypes?: {
                    [key: string]: object
                }
            }
        }
    }
    formattingUnderCursor: {
        link?: string
        linkTitle?: string
        linkTargetBlank?: boolean
        linkRelNofollow?: boolean,
    }
    executeCommand: (command: string, argument?: any, reFocusEditor?: boolean) => void
}

export const LinkButton: React.FC<Props> = props => {
    const i18n = useI18n();
    const tx = useEditorTransactions();
    const editorOptions = {
        ...props.inlineEditorOptions?.linking?.['Sitegeist.Archaeopteryx'],
        linkTypes: {
            ...props.inlineEditorOptions?.linking?.['Sitegeist.Archaeopteryx']?.linkTypes
        }
    };

    if (props.inlineEditorOptions?.linking?.startingPoint) {
        editorOptions.linkTypes['Sitegeist.Archaeopteryx:Node'] = {
            ...editorOptions.linkTypes['Sitegeist.Archaeopteryx:Node'],
            startingPoint:
                (editorOptions.linkTypes['Sitegeist.Archaeopteryx:Node'] as any).startingPoint
                ?? props.inlineEditorOptions.linking.startingPoint
        };
    }

    const handleLinkButtonClick = React.useCallback(async () => {
        const link = (() => {
            if (props.formattingUnderCursor.link) {
                const [href, anchor] = props.formattingUnderCursor.link.split('#');
                return {
                    href,
                    options: {
                        anchor,
                        title: props.formattingUnderCursor.linkTitle,
                        targetBlank: props.formattingUnderCursor.linkTargetBlank,
                        relNofollow: props.formattingUnderCursor.linkRelNofollow
                    }
                };
            }

            return null;
        })();
        const enabledLinkOptions = (() => {
            const enabledLinkOptions: (keyof ILinkOptions)[] = [];

            if (props.inlineEditorOptions?.linking?.anchor) {
                enabledLinkOptions.push('anchor');
            }

            if (props.inlineEditorOptions?.linking?.title) {
                enabledLinkOptions.push('title');
            }

            if (props.inlineEditorOptions?.linking?.relNofollow) {
                enabledLinkOptions.push('relNofollow');
            }

            if (props.inlineEditorOptions?.linking?.targetBlank) {
                enabledLinkOptions.push('targetBlank');
            }

            return enabledLinkOptions;
        })();

        const result = await tx.editLink(link, enabledLinkOptions, editorOptions);

        if (result.change) {
            if (result.value === null) {
                props.executeCommand('linkTitle', false, false);
                props.executeCommand('linkRelNofollow', false, false);
                props.executeCommand('linkTargetBlank', false, false);
                props.executeCommand('unlink', undefined, true);
            } else {
                props.executeCommand('linkTitle', result.value.options?.title || false, false);
                props.executeCommand('linkTargetBlank', result.value.options?.targetBlank ?? false, false);
                props.executeCommand('linkRelNofollow', result.value.options?.relNofollow ?? false, false);

                if (result.value.options?.anchor) {
                    props.executeCommand('link', `${result.value.href}#${result.value.options?.anchor}`, true);
                } else {
                    props.executeCommand('link', result.value.href, true);
                }
            }
        } else {
            props.executeCommand('undo', undefined, true);
            props.executeCommand('redo', undefined, true);
        }
    }, [props.executeCommand, props.formattingUnderCursor.link, tx, editorOptions]);

    return (
        <IconButton
            title={i18n('Neos.Neos.Ui:LinkEditor.Main:linkButton.title')}
            isActive={Boolean(props.formattingUnderCursor.link)}
            icon={Boolean(props.formattingUnderCursor.link) ? 'unlink' : 'link'}
            onClick={handleLinkButtonClick}
        />
    );
};
