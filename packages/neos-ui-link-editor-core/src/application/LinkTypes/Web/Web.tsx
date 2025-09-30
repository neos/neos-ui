import * as React from 'react';

import {ILink, makeLinkType} from '../../../domain';
import {IconCard} from '../../../presentation';
import {isSuitableFor} from "./WebSpecification";
import {translate} from "@neos-project/neos-ui-i18n";
import {PromiseState} from '@neos-project/framework-promise-react';
import {State} from "@neos-project/framework-observable";
import {useLatestState} from "@neos-project/framework-observable-react";
import {SelectBox, Tooltip} from "@neos-project/react-ui-components";

type WebLinkModel = {
    href: {
        value: string,
        isDirty: boolean,
        warning?: string
        formattingOptions?: any[]
    }
}

const formattingOptionForLinkWithoutHttpsProtocol = (href: string) => {
    if (!href.match(/^[\w.-]{2,}\.[\w]{2,10}$/)) {
        return null;
    }
    // looks like domain
    return {
        group: translate('Neos.Neos.Ui:LinkEditor.Web:href.formatOptions', ''),
        label: translate('Neos.Neos.Ui:LinkEditor.Web:href.formatAsHttp', ''),
        value: `https://${href}`
    };
};

const validateModel = (values: WebLinkModel): WebLinkModel => ({
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

    isSuitableFor,

    isDirty: (model) => {
        return model.href?.isDirty === true;
    },

    isValid: (model) => {
        return model.href && model.href.value.trimEnd() !== '';
    },

    useResolvedModel: (link: ILink) => {
        // todo handle url encoding
        return PromiseState.forValue(validateModel({
            href: {
                isDirty: false,
                value: link.href || '#'
            }
        }));
    },

    convertModelToLink: (model: WebLinkModel) => {
        // todo handle url encoding
        return {
            href: model.href.value,
        }
    },

    Preview: ({model}: {model: WebLinkModel}) => (
        <IconCard
            icon="external-link"
            title={model.href.value || '#'}
        />
    ),

    Editor: ({model$}: {model$: State<WebLinkModel | null>}) => {
        const model = useLatestState(model$);

        const setHref = React.useCallback((href) => model$.update((values) => validateModel({
            ...values,
            href: {
                isDirty: true,
                formattingOptions: [
                    formattingOptionForLinkWithoutHttpsProtocol(href)
                ].filter(Boolean),
                value: href
            },
        })), []);

        return (
            <div>
                <label htmlFor={`__neos__editor__property---${id}.href`}>
                    {translate('Neos.Neos.Ui:LinkEditor.Web:label.link', '')}:
                </label>
                <div>
                    <SelectBox
                        id={`__neos__editor__property---${id}.href`}
                        options={model?.href.formattingOptions ?? []}
                        optionValueField="value"
                        value={''}
                        plainInputMode={!model?.href.formattingOptions?.length}
                        placeholderIcon={'link'}
                        onValueChange={setHref}
                        threshold={0}
                        placeholder={translate('Neos.Neos.Ui:LinkEditor.Web:href.placeholder', '')}
                        displaySearchBox={true}
                        showDropDownToggle={false}
                        allowEmpty={false}
                        searchTerm={model?.href?.value ?? ''}
                        onSearchTermChange={setHref}
                    />
                    {model?.href?.warning ? (
                        <Tooltip renderInline asWarning>{model.href.warning}</Tooltip>
                    ) : null}
                </div>
            </div>
        );
    }
}));
