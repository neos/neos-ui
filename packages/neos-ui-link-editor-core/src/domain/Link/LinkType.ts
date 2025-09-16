import * as React from 'react';
import {Object} from 'ts-toolbelt';
import positionalArraySorter from '@neos-project/positional-array-sorter';

import {globalRegistry} from '@neos-project/neos-ui/globalRegistry';

import {IProcess} from '../../framework';

import {ILink, ILinkOptions} from './Link';
import {IEditor} from '../Editor';
import {useLatestState} from "@neos-project/framework-observable-react";
import {State} from "@neos-project/framework-observable";
import {Nullable} from "ts-toolbelt/out/Union/Nullable";

interface LinkTypeStaticProps<OptionsType extends object = {}> {
    link?: ILink
    options: Object.Partial<OptionsType, 'deep'>
}
interface LinkTypeProps<ModelType = any, OptionsType extends object = {}> {
    model: ModelType
    options: Object.Partial<OptionsType, 'deep'>
}

export interface ILinkType<ModelType = any, OptionsType extends object = {}> {
    id: string
    supportedLinkOptions: (keyof ILinkOptions)[]
    isSuitableFor: (link: ILink) => boolean

    useResolvedModel: (link: ILink) => IProcess<ModelType>
    convertModelToLink: (model: ModelType) => ILink
    isDirty: (model: ModelType) => boolean;
    isValid: (model: ModelType) => boolean;

    TabHeader: React.FC<LinkTypeStaticProps<OptionsType>>
    LoadingPreview: React.FC<LinkTypeStaticProps<OptionsType>>
    Preview: React.FC<LinkTypeProps<ModelType, OptionsType>>
    LoadingEditor: React.FC<LinkTypeStaticProps<OptionsType>>
    Editor: React.FC<{
        model$: State<Nullable<ModelType>>
        options: Object.Partial<OptionsType, 'deep'>
    }>
}

export interface ILinkTypeFactoryApi {
    id: string
    createError: (message: string) => Error
}

export function makeLinkType<ModelType = any, OptionsType extends object = {}>(
    id: string,
    createOptions: (factoryApi: ILinkTypeFactoryApi) => Object.Optional<
        Omit<ILinkType<ModelType, OptionsType>, 'id'>,
        'supportedLinkOptions' | 'Icon' | 'Title' | 'LoadingPreview' | 'LoadingEditor'
    >
): ILinkType<ModelType, OptionsType> {
    const createError = (message: string): Error => new Error(`[${id}]: ${message}`);
    const options = createOptions({createError, id});

    return {
        id,
        supportedLinkOptions: [],
        ...options,
        LoadingPreview: options.LoadingPreview ?? (() => React.createElement(
            'div',
            {},
            'Loading...'
        )),
        LoadingEditor: options.LoadingEditor ?? (() => React.createElement(
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
