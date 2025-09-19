import * as React from 'react';

import {ILink, makeLinkType} from '../../../domain';
import {ImageCard, IconLabel} from '../../../presentation';

import {MediaBrowser} from './MediaBrowser';
import { Nullable } from 'ts-toolbelt/out/Union/Nullable';
import {isSuitableFor} from "./AssetSpecification";
import {translate} from "@neos-project/neos-ui-i18n";
import {PromiseState, usePromise} from "@neos-project/framework-promise-react";
import backend from "@neos-project/neos-ui-backend-connector";
import {State} from "@neos-project/framework-observable";
import {useLatestState} from "@neos-project/framework-observable-react";

type AssetLinkModel = {
    isDirty: boolean
    identifier: string
}

export const Asset = makeLinkType<AssetLinkModel>('LinkEditor:Asset', ({createError}) => ({
    supportedLinkOptions: ['title', 'targetBlank', 'relNofollow'],

    isSuitableFor,

    isDirty: (model) => {
        return model.isDirty;
    },

    isValid: () => {
        return true;
    },

    useResolvedModel: (link: ILink) => {
        const match = /asset:\/\/(.*)/.exec(link.href);

        if (match) {
            return PromiseState.forValue({isDirty: false, identifier: match[1]});
        }

        return PromiseState.forError(
            createError(`Cannot handle href "${link.href}".`)
        );
    },

    convertModelToLink: (asset: AssetLinkModel) => ({
        href: `asset://${asset.identifier}`
    }),

    TabHeader: () => {
        return (
            <IconLabel icon="camera">
                {translate('Neos.Neos.Ui:LinkEditor.Asset:title', '')}
            </IconLabel>
        );
    },

    Preview: ({model}: {model: AssetLinkModel}) => {
        const asset = usePromise(() => {
            const endpoints = backend.get().endpoints;
            return endpoints.assetDetail(model.identifier);
        }, [model.identifier]);

        if (!asset.value) {
            return null;
        }

        return (
            <ImageCard
                label={asset.value.label}
                src={asset.value.preview}
            />
        );
    },

    Editor: ({model$}: {model$: State<Nullable<AssetLinkModel>>}) => {
        const model = useLatestState(model$);
        const setAsset = React.useCallback((identifier) => model$.update((values) => ({...values, isDirty: true, identifier})), []);

        return (
            <MediaBrowser
                assetIdentifier={model?.identifier ?? null}
                onSelectAsset={setAsset}
            />
        );
    }
}));

