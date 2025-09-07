import * as React from 'react';

import {ErrorBoundary} from '@neos-project/neos-ui-link-editor-error-handling';

import {FieldGroup} from '../../framework';
import {ILink, ILinkType, useEditorState} from '../../domain';

function useLastNonNull<V>(value: null | V) {
    const valueRef = React.useRef(value);

    if (value !== null) {
        valueRef.current = value;
    }

    return valueRef.current;
}

export const LinkEditor: React.FC<{
    link: null | ILink
    linkType: ILinkType
}> = props => (
    <ErrorBoundary>
        {props.link === null ? (
            <LinkEditorWithoutValue
                linkType={props.linkType}
            />
        ) : (
            <LinkEditorWithValue
                link={props.link}
                linkType={props.linkType}
            />
        )}
    </ErrorBoundary>
);

const LinkEditorWithoutValue: React.FC<{
    linkType: ILinkType
}> = props => {
    const {editorOptions} = useEditorState();
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
    link: ILink
    linkType: ILinkType
}> = props => {
    const {editorOptions} = useEditorState();
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
