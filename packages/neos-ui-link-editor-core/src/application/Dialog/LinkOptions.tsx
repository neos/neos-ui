import * as React from 'react';

import {TextInput, CheckBox} from '@neos-project/react-ui-components';

import {ILinkOptions} from '../../domain';
import {Layout} from '../../presentation';
import {translate} from "@neos-project/neos-ui-i18n";
import {State} from "@neos-project/framework-observable";
import {FormValues} from "./Dialog";
import {useLatestState} from "@neos-project/framework-observable-react";

export const LinkOptions: React.FC<{
    form$: State<FormValues>
    enabledLinkOptions: (keyof ILinkOptions)[]
}> = props => {
    const form = useLatestState(props.form$);

    const setTitle = React.useCallback((title) => props.form$.update((values) => ({ ...values, isOptionsDirty: true, options: { ...values.options, title } })), []);
    const setTargetBlank = React.useCallback((targetBlank) => props.form$.update((values) => ({ ...values, isOptionsDirty: true, options: { ...values.options, targetBlank } })), []);
    const setRelNofollow = React.useCallback((relNofollow) => props.form$.update((values) => ({ ...values, isOptionsDirty: true, options: { ...values.options, relNofollow } })), []);
    const setDownload = React.useCallback((download) => props.form$.update((values) => ({ ...values, isOptionsDirty: true, options: { ...values.options, download } })), []);

    return (
        <Layout.Stack>
            {props.enabledLinkOptions.includes('title') ? (
                <Layout.Columns>
                    {props.enabledLinkOptions.includes('title') ? (
                        <label>
                            {translate('Neos.Neos.Ui:LinkEditor.Main:options.label.title', '')}:
                            <TextInput type="text" value={form.options?.title ?? ""} placeholder={translate('Neos.Neos.Ui:LinkEditor.Main:options.placeholder.title', '')} onChange={setTitle} />
                        </label>
                    ) : null}
                </Layout.Columns>
            ) : null}
            {props.enabledLinkOptions.includes('targetBlank') || props.enabledLinkOptions.includes('relNofollow') || props.enabledLinkOptions.includes('download') ? (
                <Layout.Columns>
                    {props.enabledLinkOptions.includes('targetBlank') ? (
                        <label>
                            <CheckBox onChange={setTargetBlank} isChecked={form.options?.targetBlank ?? false}/>
                            {translate('Neos.Neos.Ui:LinkEditor.Main:options.label.targetBlank', '')}
                        </label>
                    ) : null}
                    {props.enabledLinkOptions.includes('relNofollow') ? (
                        <label>
                            <CheckBox onChange={setRelNofollow} isChecked={form.options?.relNofollow ?? false}/>
                            {translate('Neos.Neos.Ui:LinkEditor.Main:options.label.relNofollow', '')}
                        </label>
                    ) : null}
                    {props.enabledLinkOptions.includes('download') ? (
                        <label>
                            <CheckBox onChange={setDownload} isChecked={form.options?.download ?? false}/>
                            {translate('Neos.Neos.Ui:LinkEditor.Main:options.label.download', '')}
                        </label>
                    ) : null}
                </Layout.Columns>
            ) : null}
        </Layout.Stack>
    );
}
