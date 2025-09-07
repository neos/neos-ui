import * as React from 'react';
import styled from 'styled-components';
import {FieldInputProps, FieldMetaState} from 'react-final-form';

import {EditorEnvelope as NeosEditorEnvelope} from '@neos-project/neos-ui-editors/src/index';

const IsolationLayer = styled.div`
    ul, li {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }
`;

export const EditorEnvelope: React.FC<{
    label: string
    editor: string
    editorOptions?: any
    input: FieldInputProps<any>
    meta: FieldMetaState<any>
}> = props => (
    <IsolationLayer>
        <NeosEditorEnvelope
            identifier={`Sitegeist-Archaeopteryx-${props.input.name}`}
            label={props.label}
            editor={props.editor}
            options={props.editorOptions}
            validationErrors={props.meta.dirty && props.meta.error ? [props.meta.error] : []}
            value={props.input.value}
            commit={props.input.onChange}
        />
    </IsolationLayer>
);
