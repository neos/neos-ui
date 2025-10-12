import * as React from 'react';

import {IconButton} from '@neos-project/react-ui-components';

import {IEditor} from '@neos-project/neos-ui-link-editor-core';
import {ILinkOptions} from '@neos-project/neos-ui-link-editor-core/src/domain';
import {translate} from '@neos-project/neos-ui-i18n';

interface Props {
    inlineEditorOptions?: {
        linking?: {
            title?: boolean
            relNofollow?: boolean
            targetBlank?: boolean
            download?: boolean
            // legacy root level option, linkTypes."LinkEditor:Node".startingPoint should be used instead
            startingPoint?: string
            linkTypes?: {
                [key: string]: object
            }
        }
    }
    formattingUnderCursor: {
        link?: string
        linkTitle?: string
        linkTargetBlank?: boolean
        linkRelNofollow?: boolean,
        linkDownload?: boolean,
    }
    executeCommand: (command: string, argument?: any, reFocusEditor?: boolean) => void
}

export const createLinkButton = (editor: IEditor) => (props: Props) => {
    const {transactions} = editor;
    const editorOptions = {
        linkTypes: {
            ...props.inlineEditorOptions?.linking?.linkTypes
        }
    };

    if (props.inlineEditorOptions?.linking?.startingPoint) {
        // handle legacy root level option
        editorOptions.linkTypes['LinkEditor:Node'] = {
            ...editorOptions.linkTypes['LinkEditor:Node'],
            startingPoint:
                (editorOptions.linkTypes['LinkEditor:Node'] as any).startingPoint
                    ?? props.inlineEditorOptions.linking.startingPoint
        };
    }

    const handleLinkButtonClick = React.useCallback(async () => {
        const link = (() => {
            if (props.formattingUnderCursor.link) {
                return {
                    href: props.formattingUnderCursor.link,
                    options: {
                        title: props.formattingUnderCursor.linkTitle,
                        targetBlank: props.formattingUnderCursor.linkTargetBlank,
                        relNofollow: props.formattingUnderCursor.linkRelNofollow,
                        download: props.formattingUnderCursor.linkDownload
                    }
                };
            }

            return null;
        })();
        const enabledLinkOptions = (() => {
            const enabledLinkOptions: (keyof ILinkOptions)[] = [];

            if (props.inlineEditorOptions?.linking?.title) {
                enabledLinkOptions.push('title');
            }

            if (props.inlineEditorOptions?.linking?.relNofollow) {
                enabledLinkOptions.push('relNofollow');
            }

            if (props.inlineEditorOptions?.linking?.targetBlank) {
                enabledLinkOptions.push('targetBlank');
            }

            if (props.inlineEditorOptions?.linking?.download) {
                enabledLinkOptions.push('download');
            }

            return enabledLinkOptions;
        })();

        const result = await transactions.editLink(link, enabledLinkOptions, editorOptions);

        if (result.change) {
            if (result.value === null) {
                props.executeCommand('linkTitle', false, false);
                props.executeCommand('linkRelNofollow', false, false);
                props.executeCommand('linkTargetBlank', false, false);
                props.executeCommand('linkDownload', false, false);
                props.executeCommand('unlink', undefined, true);
            } else {
                props.executeCommand('linkTitle', result.value.options?.title || false, false);
                props.executeCommand('linkRelNofollow', result.value.options?.relNofollow ?? false, false);
                props.executeCommand('linkTargetBlank', result.value.options?.targetBlank ?? false, false);
                props.executeCommand('linkDownload', result.value.options?.download ?? false, false);

                props.executeCommand('link', result.value.href, true);
            }
        } else {
            props.executeCommand('undo', undefined, true);
            props.executeCommand('redo', undefined, true);
        }
    }, [props.executeCommand, props.formattingUnderCursor.link, transactions, editorOptions]);

    return (
        <IconButton
            title={translate('Neos.Neos.Ui:LinkEditor.Main:linkButton.title', '')}
            isActive={Boolean(props.formattingUnderCursor.link)}
            icon={props.formattingUnderCursor.link ? 'unlink' : 'link'}
            onClick={handleLinkButtonClick}
        />
    );
};
