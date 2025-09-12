import * as React from 'react';

import {ErrorBoundary, ErrorView} from '@neos-project/neos-ui-error';

import {FieldGroup} from '../../framework';
import {IEditor, ILink, ILinkType} from '../../domain';
import {useLatestState} from "@neos-project/framework-observable-react";

function useLastNonNull<V>(value: null | V) {
    const valueRef = React.useRef(value);

    if (value !== null) {
        valueRef.current = value;
    }

    return valueRef.current;
}

export const LinkEditor: React.FC<{
    editor: IEditor
    link: null | ILink
    linkType: ILinkType
}> = props => (
    <ErrorBoundary errorFallback={ErrorView}>
        {props.link === null ? (
            <LinkEditorWithoutValue
                editor={props.editor}
                linkType={props.linkType}
            />
        ) : (
            <LinkEditorWithValue
                editor={props.editor}
                link={props.link}
                linkType={props.linkType}
            />
        )}
    </ErrorBoundary>
);

const LinkEditorWithoutValue: React.FC<{
    editor: IEditor
    linkType: ILinkType
}> = props => {
    const {editorOptions} = useLatestState(props.editor.state$);
    const {Editor} = props.linkType;
    const prefix = `linkTypeProps.${props.linkType.id.split('.').join('_')}`;

    return (
        <FieldGroup prefix={prefix}>
            <Editor
                model={null}
                options={editorOptions.linkTypes?.[props.linkType.id] as any ?? {}}
                link={null}
            />
        </FieldGroup>
    );
}

const LinkEditorWithValue: React.FC<{
    editor: IEditor
    link: ILink
    linkType: ILinkType
}> = props => {
    const {editorOptions} = useLatestState(props.editor.state$);
    const {busy, error, result} = props.linkType.useResolvedModel(props.link);
    const model = useLastNonNull(result);
    const {Editor, LoadingEditor} = props.linkType;

    if (error) {
        throw error;
    } else if (busy && !model) {
        return (
            <LoadingEditor
                link={props.link ?? undefined}
                options={editorOptions.linkTypes?.[props.linkType.id] as any ?? {}}
            />
        );
    } else {
        return (
            <FieldGroup prefix={`linkTypeProps.${props.linkType.id.split('.').join('_')}`}>
                <Editor
                    model={model}
                    options={editorOptions.linkTypes?.[props.linkType.id] as any ?? {}}
                    link={props.link}
                />
            </FieldGroup>
        );
    }
}
