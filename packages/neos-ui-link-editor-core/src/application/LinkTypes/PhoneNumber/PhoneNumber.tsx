import * as React from 'react';

import { TextInput, Tooltip} from '@neos-project/react-ui-components';

import {ILink, makeLinkType} from "../../../domain";
import {IconCard} from "../../../presentation";
import {Nullable} from 'ts-toolbelt/out/Union/Nullable';
import {isSuitableFor} from "./PhoneNumberSpecification";
import {translate} from "@neos-project/neos-ui-i18n";
import {State} from "@neos-project/framework-observable";
import {useLatestState} from "@neos-project/framework-observable-react";

import {PromiseState} from '@neos-project/framework-promise-react';

type PhoneNumberLinkModel = {
    phoneNumber: {
        value: string
        isDirty: boolean
        warning?: string
    }
}

const VALID_PHONE_NUMBER = /^(?:\+[1-9])?[0-9]+$/;

export const PhoneNumber = makeLinkType<PhoneNumberLinkModel>('LinkEditor:PhoneNumber', ({createError, id}) => ({
    icon: "phone-alt",

    getTitle: () => translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:title', ''),

    isSuitableFor,

    isDirty: (model) => {
        return model.phoneNumber?.isDirty === true;
    },

    isValid: (model) => {
        if (!model.phoneNumber) {
            return false;
        }
        const trimmedValue = model.phoneNumber.value.trim();
        return trimmedValue !== '' && trimmedValue !== '+';
    },

    useResolvedModel: (link: ILink) => {
        if (!link.href.startsWith('tel:')) {
            return PromiseState.forError(
                createError(`Cannot handle href "${link.href}".`)
            );
        }

        return PromiseState.forValue({
            phoneNumber: {
                value: link.href.replace('tel:', ''),
                isDirty: false,
            }
        });
    },

    convertModelToLink: (model: PhoneNumberLinkModel) => {
        return {href: `tel:${model.phoneNumber.value.trim()}`};
    },

    Preview: ({model}: { model: PhoneNumberLinkModel }) => {
        return (
            <IconCard
                icon="phone-alt"
                title={model.phoneNumber.value}
            />
        )
    },

    Editor: ({model$}: { model$: State<Nullable<PhoneNumberLinkModel>> }) => {
        const model = useLatestState(model$);
        const setPhoneNumber = React.useCallback((phoneNumber) => model$.update((values) => ({
            ...values,
            phoneNumber: {
                value: phoneNumber,
                warning: !phoneNumber ? translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.validation.required', '') : (!VALID_PHONE_NUMBER.test(phoneNumber) ? translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.validation.numbersOnly', '') : undefined),
                isDirty: true,
            },
        })), []);

        return (
            <div>
                <label htmlFor={`${id}.phoneNumber`}>
                    {translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.label', '')}
                </label>

                <div>
                    <TextInput
                        id={`${id}.phoneNumber`}
                        value={model?.phoneNumber?.value ?? ''}
                        onChange={setPhoneNumber}
                        placeholder={translate('Neos.Neos.Ui:LinkEditor.Web:phoneNumber.placeholder', '')}
                    />
                    {model?.phoneNumber?.warning ? (
                        <Tooltip renderInline asWarning>{model.phoneNumber.warning}</Tooltip>
                    ) : null}
                </div>
            </div>
        );
    }
}));
