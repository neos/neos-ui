import * as React from 'react';
import {Field} from 'react-final-form';

import {TextInput, CheckBox} from '@neos-project/react-ui-components';

import {ILinkOptions} from '../../domain';
import {Layout} from '../../presentation';
import {useI18n} from '@neos-project/neos-ui-link-editor-neos-bridge';

export const Settings: React.FC<{
    enabledLinkOptions: (keyof ILinkOptions)[]
    initialValue?: {
        anchor?: string
        title?: string
        targetBlank?: boolean
        relNofollow?: boolean
    }
}> = props => {
    const i18n = useI18n();

    return (
        <Layout.Stack>
            {props.enabledLinkOptions.includes('anchor') || props.enabledLinkOptions.includes('title') ? (
                <Layout.Columns>
                    {props.enabledLinkOptions.includes('anchor') ? (
                        <Field<string>
                            name="options.anchor"
                            initialValue={props.initialValue?.anchor}
                            >
                            {({input}) => (
                                <label>
                                    {i18n('Neos.Neos.Ui:LinkEditor.Main:options.label.anchor')}:
                                    <TextInput type="text" {...input}/>
                                </label>
                            )}
                        </Field>
                    ) : null}
                    {props.enabledLinkOptions.includes('title') ? (
                        <Field<string>
                            name="options.title"
                            initialValue={props.initialValue?.title}
                            >
                            {({input}) => (
                                <label>
                                    {i18n('Neos.Neos.Ui:LinkEditor.Main:options.label.title')}:
                                    <TextInput type="text" {...input}/>
                                </label>
                            )}
                        </Field>
                    ) : null}
                </Layout.Columns>
            ) : null}
            {props.enabledLinkOptions.includes('targetBlank') || props.enabledLinkOptions.includes('relNofollow') ? (
                <Layout.Columns>
                    {props.enabledLinkOptions.includes('targetBlank') ? (
                        <Field<boolean>
                            type="checkbox"
                            name="options.targetBlank"
                            initialValue={Boolean(props.initialValue?.targetBlank)}
                            >
                            {({input}) => (
                                <label>
                                    <CheckBox onChange={input.onChange} isChecked={input.checked}/>
                                    {i18n('Neos.Neos.Ui:LinkEditor.Main:options.label.targetBlank')}
                                </label>
                            )}
                        </Field>
                    ) : null}
                    {props.enabledLinkOptions.includes('relNofollow') ? (
                        <Field<boolean>
                            type="checkbox"
                            name="options.relNofollow"
                            initialValue={Boolean(props.initialValue?.relNofollow)}
                            >
                            {({input}) => (
                                <label>
                                    <CheckBox onChange={input.onChange} isChecked={input.checked}/>
                                    {i18n('Neos.Neos.Ui:LinkEditor.Main:options.label.relNofollow')}
                                </label>
                            )}
                        </Field>
                    ) : null}
                </Layout.Columns>
            ) : null}
        </Layout.Stack>
    );
}
