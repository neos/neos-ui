import * as React from 'react';

import {Process, Field, EditorEnvelope} from '../../../framework';
import {ILink, makeLinkType} from '../../../domain';
import {IconCard, Layout, IconLabel} from '../../../presentation';
import { OptionalDeep } from 'ts-toolbelt/out/Object/Optional';
import { Nullable } from 'ts-toolbelt/out/Union/Nullable';
import {isSuitableFor} from "./MailToSpecification";
import {translate} from "@neos-project/neos-ui-i18n";
import {isEmail} from "@neos-project/utils-helpers";

type MailToLinkModel = {
    recipient: string
    subject?: string
    cc?: string
    bcc?: string
    body?: string
}

type MailToOptions = {
    enabledFields: {
        subject: boolean
        cc: boolean
        bcc: boolean
        body: boolean
    }
}

export const MailTo = makeLinkType<MailToLinkModel, MailToOptions>('Sitegeist.Archaeopteryx:MailTo', ({createError}) => ({
    isSuitableFor,

    useResolvedModel:  (link: ILink) => {
        if (!link.href.startsWith('mailto:')) {
            return Process.error(
                createError(`Cannot handle href "${link.href}".`)
            );
        }
        const url = new URL(link.href);

        return Process.success({
            recipient: url.pathname,
            subject: url.searchParams.get('subject') ?? undefined,
            cc: url.searchParams.get('cc') ?? undefined,
            bcc: url.searchParams.get('bcc') ?? undefined,
            body: url.searchParams.get('body') ?? undefined
        });
    },

    convertModelToLink: (email:MailToLinkModel) => {
        const query = Object.entries({
                subject: email.subject,
                cc: email.cc,
                bcc: email.bcc,
                body: email.body,
            })
            .filter(([_key, value]) => value != null)
            .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
            .join('&');

        const href = `mailto:${email.recipient}${query ? `?${query}` : ''}`;

        return {href};
    },

    TabHeader: () => {
        return (
            <IconLabel icon="envelope">
                {translate('Neos.Neos.Ui:LinkEditor.MailTo:title', '')}
            </IconLabel>
        );
    },

    Preview: ({model: email}: {model: MailToLinkModel}) => (
        <IconCard
            icon="envelope"
            title={email.recipient}
            subTitle={
                email.subject || email.body
                    ? `${email.subject ?? ''} ${email.body ?? ''}`.trim()
                    : undefined
            }
        />
    ),

    Editor: ({model: email, options}: {model: Nullable<MailToLinkModel>, options: OptionalDeep<MailToOptions>}) => {
        return (
            <Layout.Columns>
                <Field<string>
                    name="recipient"
                    initialValue={email?.recipient}
                    validate={value => {
                        if (!value) {
                            return translate('Neos.Neos.Ui:LinkEditor.MailTo:recipient.validation.required', '');
                        }

                        if (!isEmail(value)) {
                            return translate('Neos.Neos.Ui:LinkEditor.MailTo:recipient.validation.email', '');
                        }
                    }}
                >{({input, meta}) => (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <EditorEnvelope
                                label={translate('Neos.Neos.Ui:LinkEditor.MailTo:recipient.label', '')}
                                editor={'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                                input={input}
                                meta={meta}
                            />
                        </div>
                )}</Field>
                {options.enabledFields?.subject !== false ? (
                    <Field<string>
                        name="subject"
                        initialValue={email?.subject}
                    >{({input, meta}) => (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <EditorEnvelope
                                label={translate('Neos.Neos.Ui:LinkEditor.MailTo:subject.label', '')}
                                editor={'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                                input={input}
                                meta={meta}
                            />
                        </div>
                    )}</Field>
                ) : null}
                {options.enabledFields?.cc !== false ? (
                    <Field<string>
                        name="cc"
                        initialValue={email?.cc}
                        validate={value => {
                            if (value !== undefined && value !== null) {
                                if (!value.split(',').every(value => isEmail(value.trim()))) {
                                    return translate('Neos.Neos.Ui:LinkEditor.MailTo:cc.validation.emaillist', '');
                                }
                            }
                        }}
                    >{({input, meta}) => (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <EditorEnvelope
                                label={translate('Neos.Neos.Ui:LinkEditor.MailTo:cc.label', '')}
                                editor={'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                                editorOptions={{
                                    placeholder: translate('Neos.Neos.Ui:LinkEditor.MailTo:cc.placeholder', '')
                                }}
                                input={input}
                                meta={meta}
                            />
                        </div>
                    )}</Field>
                ) : null}
                {options.enabledFields?.bcc !== false ? (
                    <Field<string>
                        name="bcc"
                        initialValue={email?.bcc}
                        validate={value => {
                            if (value !== undefined && value !== null) {
                                if (!value.split(',').every(value => isEmail(value.trim()))) {
                                    return translate('Neos.Neos.Ui:LinkEditor.MailTo:bcc.validation.emaillist', '');
                                }
                            }
                        }}
                    >{({input, meta}) => (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <EditorEnvelope
                                label={translate('Neos.Neos.Ui:LinkEditor.MailTo:bcc.label', '')}
                                editor={'Neos.Neos/Inspector/Editors/TextFieldEditor'}
                                editorOptions={{
                                    placeholder: translate('Neos.Neos.Ui:LinkEditor.MailTo:bcc.placeholder', '')
                                }}
                                input={input}
                                meta={meta}
                            />
                        </div>
                    )}</Field>
                ) : null}
                {options.enabledFields?.body !== false ? (
                    <Field<string>
                        name="body"
                        initialValue={email?.body}
                    >{({input, meta}) => (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <EditorEnvelope
                                label={translate('Neos.Neos.Ui:LinkEditor.MailTo:body.label', '')}
                                editor={'Neos.Neos/Inspector/Editors/TextAreaEditor'}
                                input={input}
                                meta={meta}
                            />
                        </div>
                    )}</Field>
                ) : null}
            </Layout.Columns>
        );
    }
}));
