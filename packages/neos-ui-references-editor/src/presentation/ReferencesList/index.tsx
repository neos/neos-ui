import React from 'react';
import {ReferencesItem} from '../ReferencesItem'

interface ReferencesListProps {
    references: {
        breadcrumbs: {
            icon: string;
            label: string;
        }[]
        icon: string;
        label: string;
        uri: string;
        hasProperties: boolean;
    }[]
}

export const ReferencesList = (props: ReferencesListProps) => {
    return (
        <>
            {props.references.map(reference => {
                return <ReferencesItem key={reference.uri} reference={reference} isDraggable={props.references.length > 1}/>
            })}
        </>
    );
};
