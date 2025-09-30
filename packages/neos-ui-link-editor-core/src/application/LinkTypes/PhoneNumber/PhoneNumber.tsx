import * as React from 'react';

import {SelectBox, Tooltip} from '@neos-project/react-ui-components';
import type {CountryCode} from 'libphonenumber-js'

import {ILink, makeLinkType} from "../../../domain";
import {IconCard} from "../../../presentation";
import {Nullable} from 'ts-toolbelt/out/Union/Nullable';
import {OptionalDeep} from 'ts-toolbelt/out/Object/Optional';
import {isSuitableFor} from "./PhoneNumberSpecification";
import {translate} from "@neos-project/neos-ui-i18n";
import {State} from "@neos-project/framework-observable";
import {useLatestState} from "@neos-project/framework-observable-react";

import {PromiseState, usePromise} from '@neos-project/framework-promise-react';

type PhoneNumberLinkModel = {
    phoneNumber: {
        value: string
        isDirty: boolean
        warning?: string
        formattingOptions?: any[]
    }
}

const formattingOptionsForCountryCode = (phoneNumber: string, libphonenumber: typeof import('./chunk-libphonenumber')) => {

    if (!phoneNumber.startsWith('+')) {
        return null;
    }

    if (/^\+\d{1,3} /.test(phoneNumber)) {
        return null;
    }

    const searchCharacter = phoneNumber.substring(1, 2).toUpperCase();

    return libphonenumber.getCountries().map(countryCode => {
        const callingCode = libphonenumber.getCountryCallingCode(countryCode);
        if (searchCharacter !== '') {
            if (!countryCode.startsWith(searchCharacter) && !callingCode.startsWith(searchCharacter)) {
                return null;
            }
        }

        return {
            group: 'Country Codes',
            label: `${countryCode} +${callingCode}`,
            value: `+${callingCode} `
        };
    });
};

type PhoneNumberLinkOptions = {
    defaultCountry: CountryCode,
    favoredCountries: CountryCode[]
}

const VALID_PHONE_NUMBER = /^[1-9][0-9]*$/;

export const PhoneNumber = makeLinkType<PhoneNumberLinkModel, PhoneNumberLinkOptions>('LinkEditor:PhoneNumber', ({createError, id}) => ({
    icon: "phone-alt",

    getTitle: () => translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:title', ''),

    isSuitableFor,

    isDirty: (model) => {
        return model.phoneNumber?.isDirty === true;
    },

    isValid: (model) => {
        return model.phoneNumber && model.phoneNumber.value.trimEnd() !== '' && model.phoneNumber.value.trim() !== '+';
    },

    useResolvedModel: (link: ILink) => {
        const asyncModule = usePromise(() => import('./chunk-libphonenumber'), []);

        if (!asyncModule.value) {
            return asyncModule;
        }

        const {parsePhoneNumber} = asyncModule.value;

        const phoneNumber = parsePhoneNumber(link.href.replace('tel:', ''));
        if (phoneNumber) {
            return PromiseState.forValue({
                phoneNumber: {
                    value: link.href.replace('tel:', ''),
                    isDirty: false,
                }
            });
        }

        return PromiseState.forError(
            createError(`Cannot handle href "${link.href}".`)
        );
    },

    convertModelToLink: (model: PhoneNumberLinkModel) => {
        return {href: `tel:${model.phoneNumber.value}`};
    },

    Preview: ({model}: { model: PhoneNumberLinkModel }) => {
        const asyncModule = usePromise(() => import('./chunk-libphonenumber'), []);

        return (
            <IconCard
                icon="phone-alt"
                title={asyncModule.value ? (new (asyncModule.value.AsYouType)()).input(`${model.phoneNumber.value}`) : ''}
            />
        )
    },

    Editor: ({model$, options}: { model$: State<Nullable<PhoneNumberLinkModel>>, options: OptionalDeep<PhoneNumberLinkOptions> }) => {
        const asyncModule = usePromise(() => import('./chunk-libphonenumber'), []);

        if (asyncModule.error) {
            throw asyncModule.error;
        }

        if (asyncModule.isLoading) {
            return <div>Loading...</div>
        }

        return <PhoneNumberEditor model$={model$} options={options} id={id} libphonenumber={asyncModule.value} />;
    }
}));

const PhoneNumberEditor = ({model$, options, id, libphonenumber}: { model$: State<Nullable<PhoneNumberLinkModel>>, options: OptionalDeep<PhoneNumberLinkOptions>, id: string, libphonenumber: typeof import('./chunk-libphonenumber') }) => {

    const model = useLatestState(model$);
    const setPhoneNumber = React.useCallback((phoneNumber) => model$.update((values) => ({
        ...values,
        phoneNumber: {
            value: phoneNumber,
            isValid: !phoneNumber ? translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.validation.required', '') : (!VALID_PHONE_NUMBER.test(phoneNumber) ? translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.validation.numbersOnly', '') : true),
            isDirty: true,
            formattingOptions: [
                ...formattingOptionsForCountryCode(phoneNumber, libphonenumber) ?? []
            ].filter(Boolean)
        },
    })), [])

    return (
        <div>
            <label htmlFor={`${id}.phoneNumber`}>
                {translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.label', '')}
            </label>

            <div>
                <SelectBox
                    options={model?.phoneNumber.formattingOptions ?? []}
                    optionValueField="value"
                    value={''}
                    plainInputMode={!model?.phoneNumber.formattingOptions?.length}
                    placeholderIcon={'phone-alt'}
                    onValueChange={setPhoneNumber}
                    threshold={0}
                    placeholder={translate('Neos.Neos.Ui:LinkEditor.Web:phoneNumber.placeholder', '')}
                    displaySearchBox={true}
                    showDropDownToggle={false}
                    allowEmpty={false}
                    searchTerm={model?.phoneNumber?.value ?? ''}
                    onSearchTermChange={setPhoneNumber}
                />
                {model?.phoneNumber?.warning ? (
                    <Tooltip renderInline asWarning>{model.phoneNumber.warning}</Tooltip>
                ) : null}
            </div>
        </div>
    );
}
