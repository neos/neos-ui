import * as React from 'react';

import {SelectBox} from '@neos-project/react-ui-components';

import {ILink, makeLinkType} from '../../../domain';
import {IconCard} from '../../../presentation';
import {Nullable} from 'ts-toolbelt/out/Union/Nullable';
import {isSuitableFor} from "./WebSpecification";
import {translate} from "@neos-project/neos-ui-i18n";
import {PromiseState} from '@neos-project/framework-promise-react';
import {EditorEnvelope} from '@neos-project/neos-ui-editors/src/index';
import {State} from "@neos-project/framework-observable";
import {useLatestState} from "@neos-project/framework-observable-react";

type WebLinkModel = {
    protocol: {
        value: 'http' | 'https',
        isDirty: boolean
    }
    urlWithoutProtocol: {
        value: string,
        isDirty: boolean,
        isValid: true | string
    }
}

export const Web = makeLinkType<WebLinkModel>('LinkEditor:Web', ({createError, id}) => ({
    icon: "globe",

    getTitle: () => translate('Neos.Neos.Ui:LinkEditor.Web:title', ''),

    supportedLinkOptions: ['anchor', 'title', 'targetBlank', 'relNofollow', 'download'],

    isSuitableFor,

    isDirty: (model) => {
        return model.protocol?.isDirty || model.urlWithoutProtocol?.isDirty;
    },

    isValid: (model) => {
        return model.urlWithoutProtocol?.isValid === true;
    },

    useResolvedModel: (link: ILink) => {
        const matches = link.href.match(/^(https?):\/\/(.*)$/);
        if (matches) {
            const [, protocol, urlWithoutProtocol] = matches;

            return PromiseState.forValue({
                protocol: {
                    isDirty: false,
                    value: protocol as 'http' | 'https'
                },
                urlWithoutProtocol: {
                    isDirty: false,
                    isValid: true,
                    value: urlWithoutProtocol
                }
            });
        }

        return PromiseState.forError(
            createError(`Cannot handle href "${link.href}".`)
        );
    },

    convertModelToLink:(model: WebLinkModel) => ({
        href: `${model.protocol.value}://${model.urlWithoutProtocol.value}`
    }),

    Preview: ({model}: {model: WebLinkModel}) => (
        <IconCard
            icon="external-link"
            title={`${model.protocol.value}://${model.urlWithoutProtocol.value}`}
        />
    ),

    Editor: ({model$}: {model$: State<Nullable<WebLinkModel>>}) => {
        const model = useLatestState(model$);

        const setProtocol = React.useCallback((protocol: 'http' | 'https') => model$.update((values) => ({ ...values, protocol: { isDirty: true, value: protocol } })), []);
        // todo allow pasting / inserting url with protocol split value?
        const setUrlWithoutProtocol = React.useCallback((urlWithoutProtocol) => model$.update((values) => ({
            ...values,
            protocol: values?.protocol ?? { isDirty: false, value: 'https' },
            urlWithoutProtocol: {
                isDirty: true,
                isValid: !urlWithoutProtocol ? translate('Neos.Neos.Ui:LinkEditor.Web:urlWithoutProtocol.validation.required', '') : (/^https?:\/\//.test(urlWithoutProtocol) ? 'Url must be without protocol' : true),
                value: urlWithoutProtocol
            }
        })), [])

        return (
            <div>
                <label htmlFor={`${id}.urlWithoutProtocol`}>
                    {translate('Neos.Neos.Ui:LinkEditor.Web:label.link', '')}:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', minWidth: '600px' }}>
                    <div style={{margin: '0.25rem 0 0 0'}}>
                        <SelectBox
                            onValueChange={setProtocol}
                            allowEmpty={false}
                            value={model?.protocol?.value ?? 'https'}
                            options={[{
                                value: 'https',
                                label: 'HTTPS',
                                icon: 'lock'
                            }, {
                                value: 'http',
                                label: 'HTTP',
                                icon: 'unlock'
                            }]}
                        />
                    </div>
                    <div>
                        <EditorEnvelope
                            identifier={`${id}.urlWithoutProtocol`}
                            label={''}
                            editor={'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                            editorOptions={{
                                placeholder: translate('Neos.Neos.Ui:LinkEditor.Web:urlWithoutProtocol.placeholder', '')
                            }}
                            validationErrors={model?.urlWithoutProtocol?.isDirty && model.urlWithoutProtocol.isValid !== true ? [model.urlWithoutProtocol.isValid] : []}
                            value={model?.urlWithoutProtocol?.value ?? ''}
                            commit={setUrlWithoutProtocol}
                        />
                    </div>
                </div>
            </div>
        );
    }
}));
