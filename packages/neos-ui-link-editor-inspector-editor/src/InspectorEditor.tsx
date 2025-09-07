import * as React from 'react';
import styled from 'styled-components';
import {Button, Icon} from '@neos-project/react-ui-components';
import {useI18n} from '@neos-project/neos-ui-link-editor-neos-bridge';
import {ILinkType, useLinkTypeForHref, useEditorTransactions, Deletable} from '@neos-project/neos-ui-link-editor-core';
import {ErrorBoundary, decodeError} from '@neos-project/neos-ui-link-editor-error-handling';
import {ILink} from '@neos-project/neos-ui-link-editor-core/src/domain';
import {ILinkOptions} from '@neos-project/neos-ui-link-editor-core/src/domain';
import {
    convertILinkToSerializedLinkValue,
    LinkDataType,
    resolveSerializedLinkFromValue,
    serializedLinkToILink
} from "./serialisation";

export type EditorProps = {
    options?: {
        linkTypes?: Record<string, unknown>,
        anchor?: boolean
        title?: boolean
        relNofollow?: boolean
        targetBlank?: boolean
    };
    value: any;
    commit(value: any): void;
};

export const createInspectorEditor = (dataType: LinkDataType) => (props: EditorProps) => {

    const reset = () => props.commit('');

    const i18n = useI18n();
    const tx = useEditorTransactions();

    const serializedLink = resolveSerializedLinkFromValue(props.value, dataType);

    const linkType = useLinkTypeForHref(
        serializedLink.dataType === LinkDataType.valueObject ? serializedLink.value?.href ?? null : serializedLink.value
    );

    const enabledLinkOptions = React.useMemo(() => {
        const enabledLinkOptions: (keyof ILinkOptions)[] = [];

        if (serializedLink.dataType === LinkDataType.string) {
            // the simple type only allows the anchor
            if (props.options?.anchor) {
                enabledLinkOptions.push('anchor');
            }
            return enabledLinkOptions;
        }

        if (props.options?.anchor) {
            enabledLinkOptions.push('anchor');
        }

        if (props.options?.title) {
            enabledLinkOptions.push('title');
        }

        if (props.options?.relNofollow) {
            enabledLinkOptions.push('relNofollow');
        }

        if (props.options?.targetBlank) {
            enabledLinkOptions.push('targetBlank');
        }

        return enabledLinkOptions;
    }, [props.options]);

    const editLink = React.useCallback(async () => {
        const result = await tx.editLink(
            serializedLinkToILink(serializedLink),
            enabledLinkOptions,
            props.options ?? {}
        );

        if (result.change) {
            if (!result.value) {
                reset();
                return;
            }

            props.commit(
                convertILinkToSerializedLinkValue(result.value, serializedLink.dataType)
            );
        }
    }, [serializedLink, enabledLinkOptions, tx.editLink, props.options, props.commit, reset]);

    if (linkType) {
        return (
            <ErrorBoundary>
                <InspectorEditorWithLinkType
                    key={linkType.id}
                    link={serializedLinkToILink(serializedLink)!}
                    linkType={linkType}
                    options={props.options?.linkTypes?.[linkType.id] ?? {}}
                    editLink={editLink}
                    reset={reset}
                />
            </ErrorBoundary>
        );
    } else if (serializedLink.value === null) {
        return (
            <Button onClick={editLink}>
                <Icon icon="plus"/>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {i18n('Neos.Neos.Ui:LinkEditor.Main:inspector.create')}
            </Button>
        );
    } else {
        return (
            <div>
                {i18n('Neos.Neos.Ui:LinkEditor.Main:inspector.notfound', undefined, {
                    href: JSON.stringify(serializedLink.value)
                })}
                <br/>
                <br/>
                <Button onClick={editLink}>
                    <Icon icon="plus"/>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {i18n('Neos.Neos.Ui:LinkEditor.Main:inspector.create')}
                </Button>
            </div>
        );
    }
};

const SeamlessButton = styled.button`
    display: block;
    border: none;
    margin: 0;
    padding: 0;
    width: 100%;
    overflow: visible;
    background: transparent;
    color: inherit;
    font: inherit;
    line-height: normal;
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;
    -webkit-appearance: none;
    cursor: pointer;
    filter: brightness(1);
    transition: filter .2s;

    &:hover {
        filter: brightness(2) drop-shadow(0 0 1px #aaa);
    }

    &::-moz-focus-inner {
        border: 0;
        padding: 0;
    }
`;

const InspectorEditorWithLinkType: React.FC<{
    link: ILink
    linkType: ILinkType
    options: any
    editLink: () => Promise<void>
    reset: () => void
}> = props => {
    const i18n = useI18n();
    const {busy, error, result: model} = props.linkType.useResolvedModel(props.link);
    const {Preview, LoadingPreview} = props.linkType;

    if (error) {
        throw decodeError(error);
    }

    return (
        <Deletable onDelete={props.reset}>
            <SeamlessButton
                title={i18n('Neos.Neos.Ui:LinkEditor.Main:inspector.edit')}
                type="button"
                onClick={props.editLink}
            >
                {busy ? (
                    <LoadingPreview
                        link={props.link}
                        options={props.options}
                    />
                ) : (
                    <Preview
                        model={model}
                        link={props.link}
                        options={props.options}
                    />
                )}
            </SeamlessButton>
        </Deletable>
    );
};
