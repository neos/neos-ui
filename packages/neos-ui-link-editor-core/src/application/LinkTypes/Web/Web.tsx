import * as React from 'react';

import {createHrefWithAnchorForLink, ILink, makeLinkType, parseBaseHrefAndAnchorFromValue} from '../../../domain';
import {IconCard} from '../../../presentation';
import {Nullable} from 'ts-toolbelt/out/Union/Nullable';
import {isSuitableFor} from "./WebSpecification";
import {translate} from "@neos-project/neos-ui-i18n";
import {PromiseState} from '@neos-project/framework-promise-react';
import {EditorEnvelope} from '@neos-project/neos-ui-editors/src/index';
import {State} from "@neos-project/framework-observable";
import {useLatestState} from "@neos-project/framework-observable-react";

type WebLinkModel = {
    href: {
        value: string,
        isDirty: boolean,
        warning?: string
    }
}

const validateUrlWithoutProtocol = (values: WebLinkModel): WebLinkModel => ({
    ...values,
    href: {
        ...values.href,
        warning: (
            !values.href?.value ? undefined : (
                values.href.value.includes('javascript:') ? (
                    'Javascript urls are dangerous huiii buhh!'
                ) : values.href.value.startsWith('node://') ? (
                    'Node urls must be entered via the document tab'
                ) : values.href.value.startsWith('asset://') ? (
                    'Asset urls must be entered via the asset tab'
                ) : values.href.value.startsWith('tel:') ? (
                    'Telephone urls must be entered via the phone tab'
                ) : values.href.value.startsWith('mailto:') ? (
                    'Mail urls must be entered via the mail-to tab'
                ) : values.href.value.trimEnd() === '' ? (
                    'Spaces are no valid url'
                ) : undefined
            )
        )
    },
});

export const Web = makeLinkType<WebLinkModel>('LinkEditor:Web', ({id}) => ({
    icon: "globe",

    getTitle: () => translate('Neos.Neos.Ui:LinkEditor.Web:title', ''),

    supportedLinkOptions: ['title', 'targetBlank', 'relNofollow', 'download'],

    isSuitableFor,

    isDirty: (model) => {
        return model.href?.isDirty === true;
    },

    isValid: (model) => {
        return model.href && model.href.value.trimEnd() !== '';
    },

    useResolvedModel: (link: ILink) => {
        // todo handle url encoding
        return PromiseState.forValue(validateUrlWithoutProtocol({
            href: {
                isDirty: false,
                value: createHrefWithAnchorForLink(link)
            }
        }));
    },

    convertModelToLink: (model: WebLinkModel) => {
        // todo handle url encoding
        const {href, anchor} = parseBaseHrefAndAnchorFromValue(model.href.value);

        return {
            href,
            options: {
                anchor
            }
        }
    },

    Preview: ({model}: {model: WebLinkModel}) => (
        <IconCard
            icon="external-link"
            title={model.href.value || '#'}
        />
    ),

    Editor: ({model$}: {model$: State<Nullable<WebLinkModel>>}) => {
        const model = useLatestState(model$);

        const setHref = React.useCallback((href) => model$.update((values) => validateUrlWithoutProtocol({
            ...values,
            href: { isDirty: true, value: href },
        })), []);

        return (
            <div>
                <label htmlFor={`${id}.urlWithoutProtocol`}>
                    {translate('Neos.Neos.Ui:LinkEditor.Web:label.link', '')}:
                </label>
                <div>
                    <EditorEnvelope
                        identifier={`${id}.urlWithoutProtocol`}
                        label={''}
                        editor={'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                        options={{
                            placeholder: translate('Neos.Neos.Ui:LinkEditor.Web:urlWithoutProtocol.placeholder', '')
                        }}
                        validationErrors={model?.href?.warning ? [model.href.warning] : []}
                        value={model?.href?.value ?? ''}
                        commit={setHref}
                    />
                </div>
            </div>
        );
    }
}));
