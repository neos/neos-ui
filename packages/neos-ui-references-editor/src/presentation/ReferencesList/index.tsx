import React from 'react';
import {ReferencesItem} from '../ReferencesItem'
import {HoverActions} from '../HoverActions'

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
                return (
                    <HoverActions key={reference.uri} onEdit={() => {}} onDelete={() => {}}>
                        <ReferencesItem reference={reference} isDraggable={props.references.length > 1}/>
                    </HoverActions>
                );
            })}
        </>
    );
};
