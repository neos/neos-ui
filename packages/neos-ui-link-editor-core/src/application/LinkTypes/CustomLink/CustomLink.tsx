import * as React from 'react';

import {TextInput} from '@neos-project/react-ui-components';

import {ILink, makeLinkType} from "../../../domain";
import {Process, Field} from '../../../framework';
import {IconCard, IconLabel} from "../../../presentation";
import {Nullable} from 'ts-toolbelt/out/Union/Nullable';
import {isSuitableFor} from "./CustomLinkSpecification";
import {translate} from "@neos-project/neos-ui-i18n";

type CustomLinkModel = {
    customLink: string,
}

export const CustomLink = makeLinkType<CustomLinkModel>('Sitegeist.Archaeopteryx:CustomLink', () => ({
    isSuitableFor,

    useResolvedModel: (link: ILink) => {
        return Process.success({
            customLink: link.href,
        });
    },

    convertModelToLink: (model: CustomLinkModel) => {
        return {href: `${model.customLink}`};
    },

    TabHeader: () => {
        return (
            <IconLabel icon="">
                {translate('Neos.Neos.Ui:LinkEditor.CustomLink:title', '')}
            </IconLabel>
        );
    },

    Preview: ({model}: { model: CustomLinkModel }) => {
        return (
            <IconCard
                icon=""
                title={`<a href="${model.customLink}">...</a>`}
            />
        )
    },

    Editor: ({model}: { model: Nullable<CustomLinkModel> }) => {
        return (
            <div>
                <label>
                    {translate('Neos.Neos.Ui:LinkEditor.CustomLink:customLink.label', '')}
                </label>
                <div style={{display: 'grid', gridTemplateColumns: '400px 1fr', minWidth: '600px'}}>
                    <Field<string>
                        name="customLink"
                        initialValue={model?.customLink}
                        validate={
                            (value) => {
                                if (!value) {
                                    return translate('Neos.Neos.Ui:LinkEditor.CustomLink:validation.required', '');
                                }
                            }
                        }
                    >{({input}) => (
                        <TextInput
                            id={input.name}
                            type="text"
                            placeHolder={translate('Neos.Neos.Ui:LinkEditor.CustomLink:customLink.placeholder', '')}
                            {...input}
                        />
                    )}</Field>
                </div>
            </div>
        );
    }
}));

