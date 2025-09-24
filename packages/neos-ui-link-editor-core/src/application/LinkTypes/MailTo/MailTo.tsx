import * as React from 'react';

import {ILink, makeLinkType} from '../../../domain';
import {IconCard, Layout} from '../../../presentation';
import {OptionalDeep} from 'ts-toolbelt/out/Object/Optional';
import {Nullable} from 'ts-toolbelt/out/Union/Nullable';
import {isSuitableFor} from "./MailToSpecification";
import {translate} from "@neos-project/neos-ui-i18n";
import {isEmail} from "@neos-project/utils-helpers";
import {PromiseState} from '@neos-project/framework-promise-react';
import {State} from "@neos-project/framework-observable";
import {useLatestState} from "@neos-project/framework-observable-react";
import {EditorEnvelope} from '@neos-project/neos-ui-editors/src/index';

type FormValue<T> = {
    value: T,
    isValid: string | true,
    isDirty: boolean
}

function createFormValue<T>(value: T): Nullable<FormValue<T>> {
    if (value === undefined || value === null) {
        return undefined;
    }
    return {
        value,
        isDirty: false,
        isValid: true,
    }
}

const makeUpdateFormValue = (valueAsObject: { [name: string]: any }, validator: () => true | string) => {
    const [[property, value]] = Object.entries(valueAsObject);

    return (values: any) => ({
        ...values,
        [property]: {
            value,
            isValid: validator(),
            isDirty: true
        }
    })
}


type MailToLinkModel = {
    recipient: FormValue<string>
    subject?: FormValue<string>
    cc?: FormValue<string>
    bcc?: FormValue<string>
    body?: FormValue<string>
}

type MailToOptions = {
    enabledFields: {
        subject: boolean
        cc: boolean
        bcc: boolean
        body: boolean
    }
}

export const MailTo = makeLinkType<MailToLinkModel, MailToOptions>('LinkEditor:MailTo', ({createError, id}) => ({
    icon: "envelope",

    getTitle: () => translate('Neos.Neos.Ui:LinkEditor.MailTo:title', ''),

    isSuitableFor,

    isDirty: (model) => {
        return Object.values(model).some((value) => value?.isDirty);
    },

    isValid: (model) => {
        if (!model.recipient) {
            return false;
        }
        return Object.values(model).every((value) => value?.isValid === true);
    },

    useResolvedModel:  (link: ILink) => {
        if (!link.href.startsWith('mailto:')) {
            return PromiseState.forError(
                createError(`Cannot handle href "${link.href}".`)
            );
        }
        const url = new URL(link.href);

        return PromiseState.forValue({
            recipient: createFormValue(url.pathname)!,
            subject: createFormValue(url.searchParams.get('subject') ?? undefined),
            cc: createFormValue(url.searchParams.get('cc') ?? undefined),
            bcc: createFormValue(url.searchParams.get('bcc') ?? undefined),
            body: createFormValue(url.searchParams.get('body') ?? undefined)
        });
    },

    convertModelToLink: (email: MailToLinkModel) => {
        const query = Object.entries({
                subject: email.subject?.value,
                cc: email.cc?.value,
                bcc: email.bcc?.value,
                body: email.body?.value,
            })
            .filter(([_key, value]) => value != null)
            .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
            .join('&');

        const href = `mailto:${email.recipient?.value}${query ? `?${query}` : ''}`;

        return {href};
    },

    Preview: ({model: email}: {model: MailToLinkModel}) => (
        <IconCard
            icon="envelope"
            title={email.recipient.value}
            subTitle={
                email.subject || email.body
                    ? `${email.subject?.value ?? ''} ${email.body?.value ?? ''}`.trim()
                    : undefined
            }
        />
    ),

    Editor: ({model$, options}: {model$: State<Nullable<MailToLinkModel>>, options: OptionalDeep<MailToOptions>}) => {

        const setRecipient = React.useCallback((recipient) => model$.update(makeUpdateFormValue({recipient}, () => {
            if (!recipient) {
                return translate('Neos.Neos.Ui:LinkEditor.MailTo:recipient.validation.required', '');
            }
            if (!isEmail(recipient)) {
                return translate('Neos.Neos.Ui:LinkEditor.MailTo:recipient.validation.email', '');
            }
            return true;
        })), []);

        const setSubject = React.useCallback((subject) => model$.update(makeUpdateFormValue({subject}, () => true)), []);

        const setCc = React.useCallback((cc: Nullable<string>) => model$.update(makeUpdateFormValue({cc}, () => {
            if (cc) {
                if (!cc.split(',').every(value => isEmail(value.trim()))) {
                    return translate('Neos.Neos.Ui:LinkEditor.MailTo:cc.validation.emaillist', '');
                }
            }
            return true;
        })), []);

        const setBcc = React.useCallback((bcc: Nullable<string>) => model$.update(makeUpdateFormValue({bcc}, () => {
            if (bcc) {
                if (!bcc.split(',').every(value => isEmail(value.trim()))) {
                    return translate('Neos.Neos.Ui:LinkEditor.MailTo:bcc.validation.emaillist', '');
                }
            }
            return true;
        })), []);

        const setBody = React.useCallback((body) => model$.update(makeUpdateFormValue({body}, () => true)), []);

        const email = useLatestState(model$);

        return (
            <Layout.Columns>
                <div style={{ gridColumn: '1 / -1' }}>
                    <EditorEnvelope
                        identifier={`${id}.recipient`}
                        label={translate('Neos.Neos.Ui:LinkEditor.MailTo:recipient.label', '')}
                        editor={'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                        options={{}}
                        validationErrors={(email?.recipient?.isDirty && email?.recipient.isValid !== true) ? [email?.recipient.isValid] : []}
                        value={email?.recipient?.value ?? ''}
                        commit={setRecipient}
                    />
                </div>

                {options.enabledFields?.subject !== false ? (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <EditorEnvelope
                            identifier={`${id}.subject`}
                            label={translate('Neos.Neos.Ui:LinkEditor.MailTo:subject.label', '')}
                            editor={'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                            options={{}}
                            validationErrors={(email?.subject?.isDirty && email?.subject.isValid !== true) ? [email?.subject.isValid] : []}
                            value={email?.subject?.value ?? ''}
                            commit={setSubject}
                        />
                    </div>
                ) : null}
                {options.enabledFields?.cc !== false ? (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <EditorEnvelope
                            identifier={`${id}.cc`}
                            label={translate('Neos.Neos.Ui:LinkEditor.MailTo:cc.label', '')}
                            editor={'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                            options={{
                                placeholder: translate('Neos.Neos.Ui:LinkEditor.MailTo:cc.placeholder', '')
                            }}
                            validationErrors={(email?.cc?.isDirty && email?.cc.isValid !== true) ? [email?.cc.isValid] : []}
                            value={email?.cc?.value ?? ''}
                            commit={setCc}
                        />
                    </div>
                ) : null}
                {options.enabledFields?.bcc !== false ? (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <EditorEnvelope
                            identifier={`${id}.bcc`}
                            label={translate('Neos.Neos.Ui:LinkEditor.MailTo:bcc.label', '')}
                            editor={'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                            options={{
                                placeholder: translate('Neos.Neos.Ui:LinkEditor.MailTo:bcc.placeholder', '')
                            }}
                            validationErrors={(email?.bcc?.isDirty && email?.bcc.isValid !== true) ? [email?.bcc.isValid] : []}
                            value={email?.bcc?.value ?? ''}
                            commit={setBcc}
                        />
                    </div>
                ) : null}
                {options.enabledFields?.body !== false ? (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <EditorEnvelope
                            identifier={`${id}.body`}
                            label={translate('Neos.Neos.Ui:LinkEditor.MailTo:body.label', '')}
                            editor={'Neos.Neos/Inspector/Editors/TextAreaEditor'}
                            value={email?.body?.value ?? ''}
                            commit={setBody}
                        />
                    </div>
                ) : null}
            </Layout.Columns>
        );
    }
}));
