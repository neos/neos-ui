import * as React from 'react';
import {useState} from 'react';
import {useForm} from 'react-final-form';

import {SelectBox} from '@neos-project/react-ui-components';
import {getCountries, getCountryCallingCode, parsePhoneNumber, AsYouType, CountryCode} from 'libphonenumber-js/max'

import {ILink, makeLinkType} from "../../../domain";
import {Process, Field, EditorEnvelope} from '../../../framework';
import {IconCard, IconLabel} from "../../../presentation";
import {Nullable} from 'ts-toolbelt/out/Union/Nullable';
import {OptionalDeep} from 'ts-toolbelt/out/Object/Optional';
import {isSuitableFor} from "./PhoneNumberSpecification";
import {translate} from "@neos-project/neos-ui-i18n";

type PhoneNumberLinkModel = {
    phoneNumber: string,
    countryCallingCode: string
}

type PhoneNumberLinkOptions = {
    defaultCountry: CountryCode,
    favoredCountries: CountryCode[]
}

export const PhoneNumber = makeLinkType<PhoneNumberLinkModel, PhoneNumberLinkOptions>('Sitegeist.Archaeopteryx:PhoneNumber', ({createError}) => ({

    isSuitableFor,

    useResolvedModel: (link: ILink) => {
        const phoneNumber = parsePhoneNumber(link.href.replace('tel:', ''));
        if (phoneNumber) {
            return Process.success({
                phoneNumber: phoneNumber.number.replace(`+${phoneNumber.countryCallingCode}`, ''),
                countryCallingCode: `+${phoneNumber.countryCallingCode.toString()}`,
            });
        }

        return Process.error(
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
        return (
            <IconCard
                icon="phone-alt"
                title={(new AsYouType()).input(`${model.countryCallingCode}${model.phoneNumber}`)}
            />
        )
    },

    Editor: ({
                 model,
                 options
             }: { model: Nullable<PhoneNumberLinkModel>, options: OptionalDeep<PhoneNumberLinkOptions> }) => {
        const defaultCountryCallingCode: string = model?.countryCallingCode || (options?.defaultCountry ? `+${getCountryCallingCode(options?.defaultCountry).toString()}` : `+${getCountryCallingCode(getCountries()[0]).toString()}`)

        const [areaCode, setAreaCode] = useState<string>(defaultCountryCallingCode);

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
        const checkRegex = /^[1-9][0-9]*$/;

        return (
            <div>
                <label htmlFor="linkTypeProps.Sitegeist_Archaeopteryx:PhoneNumber.phoneNumber">
                    {translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.label', '')}
                </label>
                <div style={{display: 'grid', gridTemplateColumns: '160px 1fr', minWidth: '600px'}}>
                    <Field<string>
                        name='countryCallingCode'
                        format={value => {
                            if (value !== undefined || value !== '') {
                                setAreaCode(value)
                            }
                            if (value === '' || value === undefined) {
                                useForm().change('linkTypeProps.Sitegeist_Archaeopteryx:PhoneNumber.countryCallingCode', areaCode);
                            }
                            return value;
                        }}
                        initialValue={areaCode || defaultCountryCallingCode}
                        validate={
                            (value) => {
                                if (!value) {
                                    return translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:countryCallingCode.validation.required', '');
                                }
                            }
                        }
                    >{({input}) => (
                        <div style={{margin: '0.25rem 0 0 0'}}>
                            <SelectBox
                                allowEmpty={false}
                                options={Object.values(countryCallingCodes)}
                                onValueChange={(newValue: string) => {setAreaCode(newValue); input.onChange(newValue);}}
                                value={input.value}
                            />
                        </div>
                    )}</Field>
                    <Field<string>
                        name="phoneNumber"
                        initialValue={model?.phoneNumber}
                        validate={value => {
                            if (!value) {
                                return translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.validation.required', '');
                            }
                            if (!checkRegex.test(value)) {
                                return translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.validation.numbersOnly', '');
                            }
                        }}
                    >{({input, meta}) => (
                        <EditorEnvelope
                            label={''}
                            editor={'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                            editorOptions={{
                                placeholder: translate('Neos.Neos.Ui:LinkEditor.PhoneNumber:phoneNumber.placeholder', '')
                            }}
                            input={input}
                            meta={meta}
                        />
                    )}</Field>
                </div>
            </div>
        );
    }
}));
