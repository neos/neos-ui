import * as React from 'react';

import {EditorEnvelope} from '@neos-project/neos-ui-editors/src/index';
import {ILink, makeLinkType} from "../../../domain";
import {IconCard} from "../../../presentation";
import {isSuitableFor} from "./CustomLinkSpecification";
import {translate} from "@neos-project/neos-ui-i18n";
import {useLatestState} from "@neos-project/framework-observable-react";
import {State} from "@neos-project/framework-observable";
import {Nullable} from "ts-toolbelt/out/Union/Nullable";
import {PromiseState} from '@neos-project/framework-promise-react';

type CustomLinkModel = {
    isDirty: boolean;
    isValid: true | string;
    customLink: string;
}

export const CustomLink = makeLinkType<CustomLinkModel>('LinkEditor:CustomLink', ({id}) => ({
    icon: "question",

    getTitle: () => translate('Neos.Neos.Ui:LinkEditor.CustomLink:title', ''),

    isSuitableFor,

    isDirty: (model) => {
        return model.isDirty;
    },

    isValid: (model) => {
        return model.isValid === true;
    },

    useResolvedModel: (link: ILink) => {
        return PromiseState.forValue({
            isDirty: false,
            isValid: true,
            customLink: link.href,
        });
    },

    convertModelToLink: (model: CustomLinkModel) => {
        return {href: `${model.customLink}`};
    },

    Preview: ({model}: { model: CustomLinkModel }) => {
        return (
            <IconCard
                icon=""
                title={`<a href="${model.customLink}">...</a>`}
            />
        )
    },

    Editor: ({model$}: { model$: State<Nullable<CustomLinkModel>> }) => {
        const setCustomLink = React.useCallback((customLink) => model$.update((values) => ({ ...values, isDirty: true, isValid: !customLink ? translate('Neos.Neos.Ui:LinkEditor.CustomLink:validation.required', '') : true, customLink })), []);
        const model = useLatestState(model$);

        return (
            <div>
                <label htmlFor={`${id}.customLink`}>
                    {translate('Neos.Neos.Ui:LinkEditor.CustomLink:customLink.label', '')}
                </label>
                <div>
                    <EditorEnvelope
                        identifier={`${id}.customLink`}
                        label={''}
                        editor={'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                        editorOptions={{
                            placeholder:translate('Neos.Neos.Ui:LinkEditor.CustomLink:customLink.placeholder', '')
                        }}
                        validationErrors={(model?.isDirty && model.isValid !== true) ? [model.isValid] : []}
                        value={model?.customLink ?? ''}
                        commit={setCustomLink}
                    />
                </div>
            </div>
        );
    }
}));

