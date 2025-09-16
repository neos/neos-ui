import * as React from 'react';

import {SelectBox} from '@neos-project/react-ui-components';
import type {CountryCode} from 'libphonenumber-js'

import {ILink, makeLinkType} from "../../../domain";
import {IconCard, IconLabel} from "../../../presentation";
import {Nullable} from 'ts-toolbelt/out/Union/Nullable';
import {OptionalDeep} from 'ts-toolbelt/out/Object/Optional';
import {isSuitableFor} from "./PhoneNumberSpecification";
import {translate} from "@neos-project/neos-ui-i18n";
import {State} from "@neos-project/framework-observable";
import {useLatestState} from "@neos-project/framework-observable-react";

import {EditorEnvelope} from '@neos-project/neos-ui-editors/src/index';
import {PromiseState, usePromise} from '@neos-project/framework-promise-react';

type PhoneNumberLinkModel = {
    isPhoneNumberDirty: boolean
    isPhoneNumberValid: true | string
    phoneNumber: string
    isCountryCallingCodeDirty: boolean
    countryCallingCode: string
}

type PhoneNumberLinkOptions = {
    defaultCountry: CountryCode,
    favoredCountries: CountryCode[]
}

const VALID_PHONE_NUMBER = /^[1-9][0-9]*$/;

export const PhoneNumber = makeLinkType<PhoneNumberLinkModel, PhoneNumberLinkOptions>('Sitegeist.Archaeopteryx:PhoneNumber', ({createError, id}) => ({

    isSuitableFor,

    isDirty: (model) => {
        return model.isPhoneNumberDirty || model.isCountryCallingCodeDirty;
    },

    isValid: (model) => {
        return model.isPhoneNumberValid === true;
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
                isPhoneNumberDirty: false,
                isPhoneNumberValid: true,
                phoneNumber: phoneNumber.number.replace(`+${phoneNumber.countryCallingCode}`, ''),
                isCountryCallingCodeDirty: false,
                countryCallingCode: `+${phoneNumber.countryCallingCode.toString()}`,
            });
        }

        return PromiseState.forError(
            createError(`Cannot handle href "${link.href}".`)
        );
    },

    convertModelToLink: (model: PhoneNumberLinkModel) => {
        return {href: `tel:${model.countryCallingCode}${model.phoneNumber}`};
    },

    TabHeader: () => {
        return (
            <IconLabel icon="phone-alt">
                {translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:title', '')}
            </IconLabel>
        );
    },

    Preview: ({model}: { model: PhoneNumberLinkModel }) => {
        const asyncModule = usePromise(() => import('./chunk-libphonenumber'), []);

        return (
            <IconCard
                icon="phone-alt"
                title={asyncModule.value ? (new (asyncModule.value.AsYouType)()).input(`${model.countryCallingCode}${model.phoneNumber}`) : ''}
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
    const {getCountries, getCountryCallingCode} = libphonenumber;

    const defaultCountryCallingCode = (options?.defaultCountry ? `+${getCountryCallingCode(options?.defaultCountry).toString()}` : `+${getCountryCallingCode(getCountries()[0]).toString()}`);

    const model = useLatestState(model$);
    const setCountryCallingCode = React.useCallback((countryCallingCode: string) => model$.update((values) => ({ ...values, countryCallingCode, isCountryCallingCodeDirty: true })), []);
    const setPhoneNumber = React.useCallback((phoneNumber) => model$.update((values) => ({
        ...values,
        phoneNumber,
        countryCallingCode: values?.countryCallingCode ?? defaultCountryCallingCode,
        isPhoneNumberValid: !phoneNumber ? translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.validation.required', '') : (!VALID_PHONE_NUMBER.test(phoneNumber) ? translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.validation.numbersOnly', '') : true),
        isPhoneNumberDirty: true
    })), [])

    // todo memo result
    const countryCallingCodes = {} as { [key: string]: { value: string, label: string } };
    options.favoredCountries?.map((country) => {
        if (!countryCallingCodes[`+${getCountryCallingCode(country as CountryCode)}`]) {
            countryCallingCodes[`+${getCountryCallingCode(country as CountryCode)}`] = {
                value: `+${getCountryCallingCode(country as CountryCode)}`,
                label: `${country} +${getCountryCallingCode(country as CountryCode)}`
            };
        } else {
            countryCallingCodes[`+${getCountryCallingCode(country as CountryCode)}`] = {
                value: `+${getCountryCallingCode(country as CountryCode)}`,
                label: `${countryCallingCodes[`+${getCountryCallingCode(country as CountryCode)}`].label.split(/\s\+/)[0]}, ${country} +${getCountryCallingCode(country as CountryCode)}`
            };
        }
    })

    getCountries().map((country) => {
        if (options.favoredCountries?.includes(country)) {
            return;
        }

        if (!countryCallingCodes[`+${getCountryCallingCode(country)}`]) {
            countryCallingCodes[`+${getCountryCallingCode(country)}`] = {
                value: `+${getCountryCallingCode(country)}`,
                label: `${country} +${getCountryCallingCode(country)}`
            };
        } else {
            countryCallingCodes[`+${getCountryCallingCode(country)}`] = {
                value: `+${getCountryCallingCode(country)}`,
                label: `${countryCallingCodes[`+${getCountryCallingCode(country)}`].label.split(/\s\+/)[0]}, ${country} +${getCountryCallingCode(country)}`
            };
        }
    })

    return (
        <div>
            <label htmlFor={`${id}.phoneNumber`}>
                {translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.label', '')}
            </label>
            <div style={{display: 'grid', gridTemplateColumns: '160px 1fr', minWidth: '600px'}}>
                <div style={{margin: '0.25rem 0 0 0'}}>
                    <SelectBox
                        allowEmpty={false}
                        options={Object.values(countryCallingCodes)}
                        onValueChange={setCountryCallingCode}
                        value={model?.countryCallingCode || defaultCountryCallingCode}
                    />
                </div>
                <div>
                    <EditorEnvelope
                        identifier={`${id}.phoneNumber`}
                        label={''}
                        editor={'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                        editorOptions={{
                            placeholder: translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.placeholder', '')
                        }}
                        validationErrors={model?.isPhoneNumberDirty && model.isPhoneNumberValid !== true ? [model.isPhoneNumberValid] : []}
                        value={model?.phoneNumber ?? ''}
                        commit={setPhoneNumber}
                    />
                </div>
            </div>
        </div>
    );
}
