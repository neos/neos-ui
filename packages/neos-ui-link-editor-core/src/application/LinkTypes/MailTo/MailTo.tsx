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
import {TextArea, TextInput, Tooltip} from '@neos-project/react-ui-components';

type FormValue<T> = {
    value: T,
    warning?: string,
    isDirty: boolean
}

function createFormValue<T>(value: T): Nullable<FormValue<T>> {
    if (value === undefined || value === null) {
        return undefined;
    }
    return {
        value,
        isDirty: false,
        warning: undefined,
    }
}

type MailToLinkModel = {
    recipient: FormValue<string>
    subject?: FormValue<string>
    cc?: FormValue<string>
    bcc?: FormValue<string>
    body?: FormValue<string>
}

function makeUpdateFormValue<K extends keyof MailToLinkModel & string>(valueAsObject: Record<K, any>, validator: () => void | string) {
    const [[property, value]] = Object.entries(valueAsObject);

    return (values: any) => ({
        ...values,
        [property]: {
            value,
            warning: validator(),
            isDirty: true
        }
    })
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
        if (!model.recipient || model.recipient.value.trim() === '') {
            return false;
        }
        return true;
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
            return;
        })), []);

        const setSubject = React.useCallback((subject) => model$.update(makeUpdateFormValue({subject}, () => {})), []);

        const setCc = React.useCallback((cc: Nullable<string>) => model$.update(makeUpdateFormValue({cc}, () => {
            if (cc) {
                if (!cc.split(',').every(value => isEmail(value.trim()))) {
                    return translate('Neos.Neos.Ui:LinkEditor.MailTo:cc.validation.emaillist', '');
                }
            }
            return;
        })), []);

        const setBcc = React.useCallback((bcc: Nullable<string>) => model$.update(makeUpdateFormValue({bcc}, () => {
            if (bcc) {
                if (!bcc.split(',').every(value => isEmail(value.trim()))) {
                    return translate('Neos.Neos.Ui:LinkEditor.MailTo:bcc.validation.emaillist', '');
                }
            }
            return;
        })), []);

        const setBody = React.useCallback((body) => model$.update(makeUpdateFormValue({body}, () => {})), []);

        const email = useLatestState(model$);

        return (
            <Layout.Columns>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor={`__neos__editor__property---${id}.recipient`}>{translate('Neos.Neos.Ui:LinkEditor.MailTo:recipient.label', '')}</label>
                    <TextInput
                        id={`__neos__editor__property---${id}.recipient`}
                        value={email?.recipient?.value ?? ''}
                        onChange={setRecipient}
                    />
                    {email?.recipient?.isDirty && email?.recipient.warning ? (
                        <Tooltip renderInline asWarning>{email?.recipient.warning}</Tooltip>
                    ) : null}
                </div>

                {options.enabledFields?.subject !== false ? (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor={`__neos__editor__property---${id}.subject`}>{translate('Neos.Neos.Ui:LinkEditor.MailTo:subject.label', '')}</label>
                        <TextInput
                            id={`__neos__editor__property---${id}.subject`}
                            value={email?.subject?.value ?? ''}
                            onChange={setSubject}
                        />
                        {email?.subject?.isDirty && email?.subject.warning ? (
                            <Tooltip renderInline asWarning>{email?.subject.warning}</Tooltip>
                        ) : null}
                    </div>
                ) : null}
                {options.enabledFields?.cc !== false ? (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor={`__neos__editor__property---${id}.cc`}>{translate('Neos.Neos.Ui:LinkEditor.MailTo:cc.label', '')}</label>
                        <TextInput
                            id={`__neos__editor__property---${id}.cc`}
                            value={email?.cc?.value ?? ''}
                            onChange={setCc}
                            placeholder={translate('Neos.Neos.Ui:LinkEditor.MailTo:cc.placeholder', '')}
                        />
                        {email?.cc?.isDirty && email?.cc.warning ? (
                            <Tooltip renderInline asWarning>{email?.cc.warning}</Tooltip>
                        ) : null}
                    </div>
                ) : null}
                {options.enabledFields?.bcc !== false ? (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor={`__neos__editor__property---${id}.bcc`}>{translate('Neos.Neos.Ui:LinkEditor.MailTo:bcc.label', '')}</label>
                        <TextInput
                            id={`__neos__editor__property---${id}.bcc`}
                            value={email?.bcc?.value ?? ''}
                            onChange={setBcc}
                            placeholder={translate('Neos.Neos.Ui:LinkEditor.MailTo:bcc.placeholder', '')}
                        />
                        {email?.bcc?.isDirty && email?.bcc.warning ? (
                            <Tooltip renderInline asWarning>{email?.bcc.warning}</Tooltip>
                        ) : null}
                    </div>
                ) : null}
                {options.enabledFields?.body !== false ? (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label htmlFor={`__neos__editor__property---${id}.body`}>{translate('Neos.Neos.Ui:LinkEditor.MailTo:body.label', '')}</label>
                        <TextArea
                            id={`__neos__editor__property---${id}.body`}
                            value={email?.body?.value ?? ''}
                            onChange={setBody}
                        />
                        {email?.body?.isDirty && email?.body.warning ? (
                            <Tooltip renderInline asWarning>{email?.body.warning}</Tooltip>
                        ) : null}
                    </div>
                ) : null}
            </Layout.Columns>
        );
    }
}));
