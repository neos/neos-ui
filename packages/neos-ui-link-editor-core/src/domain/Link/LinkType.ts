import * as React from 'react';
import positionalArraySorter from '@neos-project/positional-array-sorter';

import {globalRegistry} from '@neos-project/neos-ui/globalRegistry';

import {ILink} from './Link';
import {IEditor} from '../Editor';
import {useLatestState} from "@neos-project/framework-observable-react";
import {State} from "@neos-project/framework-observable";
import {IPromiseState} from "@neos-project/framework-promise-react";

interface LinkTypeStaticProps<OptionsType extends object = {}> {
    link?: ILink
    options: OptionsType
}
interface LinkTypeProps<ModelType = any, OptionsType extends object = {}> {
    model: ModelType
    options: OptionsType
}

export interface ILinkType<ModelType = any, OptionsType extends object = {}> {
    id: string

    icon: string
    getTitle: () => string

    isSuitableFor: (link: Pick<ILink, 'href'>) => boolean

    useResolvedModel: (link: ILink) => IPromiseState<ModelType>
    convertModelToLink: (model: ModelType) => Pick<ILink, 'href'>
    isDirty: (model: ModelType) => boolean;
    isValid: (model: ModelType) => boolean;

    LoadingPreview: React.FC<LinkTypeStaticProps<OptionsType>>
    Preview: React.FC<LinkTypeProps<ModelType, OptionsType>>
    LoadingEditor: React.FC<LinkTypeStaticProps<OptionsType>>
    Editor: React.FC<{
        model$: State<ModelType | null>
        options: OptionsType
    }>
}

export interface ILinkTypeFactoryApi {
    id: string
    createError: (message: string) => Error
}

export function makeLinkType<ModelType = any, OptionsType extends object = {}>(
    id: string,
    createOptions: (factoryApi: ILinkTypeFactoryApi) => Omit<ILinkType<ModelType, OptionsType>, 'id' | 'LoadingPreview' | 'LoadingEditor'>
): ILinkType<ModelType, OptionsType> {
    const createError = (message: string): Error => new Error(`[${id}]: ${message}`);
    const options = createOptions({createError, id});

    return {
        id,
        ...options,
        LoadingPreview: (options as any).LoadingPreview ?? (() => React.createElement(
            'div',
            {},
            'Loading...'
        )),
        LoadingEditor: (options as any).LoadingEditor ?? (() => React.createElement(
            'div',
            {},
            'Loading...'
        ))
    };
}

export function useLinkTypes(): ILinkType[] {
    return globalRegistry.get('@neos-project/neos-ui-link-editor/link-types')?.getAllAsList() ?? [];
}

export function useLinkTypeForHref(href: null | string): null | ILinkType {
    const linkTypes = useLinkTypes();
    const result = React.useMemo(() => {
        if (href === null) {
            return null;
        }

        for (const linkType of [...linkTypes].reverse()) {
            if (linkType.isSuitableFor({href})) {
                return linkType;
            }
        }

        return null;
    }, [linkTypes, href]);

    return result;
}

export function useSortedAndFilteredLinkTypes(editor: IEditor): ILinkType[] {
    const linkTypes = useLinkTypes();
    const {editorOptions} = useLatestState(editor.state$);

    const linkTypesAndEditorOptions = linkTypes.map(
        (linkType) => ({
            linkType,
            options: editorOptions.linkTypes?.[linkType.id]
        })
    )

    const sortedLinkTypesViaEditorOptionsPosition = positionalArraySorter(
        linkTypesAndEditorOptions,
        // badly typed
        ({options}) => options?.position
    )

    const filteredLinkTypes = sortedLinkTypesViaEditorOptionsPosition.filter(
        ({options}) => (options && "enabled" in options) ? options.enabled : true
    )

    return filteredLinkTypes.map(
        ({linkType}) => linkType
    );
}
