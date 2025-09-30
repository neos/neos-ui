import * as React from 'react';

import {ILink, makeLinkType} from '../../../domain';
import {ImageCard} from '../../../presentation';

import {MediaBrowser} from './MediaBrowser';
import { Nullable } from 'ts-toolbelt/out/Union/Nullable';
import {isSuitableFor} from "./AssetSpecification";
import {translate} from "@neos-project/neos-ui-i18n";
import {PromiseState, usePromise} from "@neos-project/framework-promise-react";
import backend from "@neos-project/neos-ui-backend-connector";
import {State} from "@neos-project/framework-observable";
import {useLatestState} from "@neos-project/framework-observable-react";
import {TextInput} from "@neos-project/react-ui-components";

type AssetLinkModel = {
    isDirty: boolean
    identifier?: string,
    anchor?: string
}

export const Asset = makeLinkType<AssetLinkModel>('LinkEditor:Asset', ({createError}) => ({
    icon: "camera",

    getTitle: () => translate('Neos.Neos.Ui:LinkEditor.Asset:title', ''),

    isSuitableFor,

    isDirty: (model) => {
        return model.isDirty;
    },

    isValid: (model) => {
        return Boolean(model.identifier);
    },

    useResolvedModel: (link: ILink) => {
        const match = /asset:\/\/([^#]*)(?:#(.*))?/.exec(link.href);

        if (!match) {
            return PromiseState.forError(createError(`Cannot handle href "${link.href}".`));
        }

        const identifier = match[1];
        const anchor = match[2];

        return PromiseState.forValue({ isDirty: false, identifier, anchor });
    },

    convertModelToLink: ({ identifier, anchor }: AssetLinkModel) => ({
        href: `asset://${identifier}${anchor ? `#${anchor}` : ''}`,
    }),

    Preview: ({model}: {model: AssetLinkModel}) => {
        const asset = usePromise(() => {
            const endpoints = backend.get().endpoints;
            return endpoints.assetDetail(model.identifier!);
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
        const setAnchor = React.useCallback((anchor) => model$.update((values) => ({...values, isDirty: true, anchor})), []);

        return (<>
            <MediaBrowser
                assetIdentifier={model?.identifier ?? null}
                onSelectAsset={setAsset}
            />
            <label>
                {translate('Neos.Neos.Ui:LinkEditor.Asset:anchor.label', '')}:
                <TextInput type="text" value={model?.anchor ?? ""} placeholder={translate('Neos.Neos.Ui:LinkEditor.Asset:anchor.placeholder', '')} onChange={setAnchor} />
            </label>
        </>);
    }
}));

