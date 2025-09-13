import * as React from 'react';

import {TextInput, CheckBox} from '@neos-project/react-ui-components';

import {ILinkOptions} from '../../domain';
import {Layout} from '../../presentation';
import {translate} from "@neos-project/neos-ui-i18n";
import {State} from "@neos-project/framework-observable";
import {FormValues} from "./Dialog";
import {useLatestState} from "@neos-project/framework-observable-react";

export const Settings: React.FC<{
    form$: State<FormValues>
    enabledLinkOptions: (keyof ILinkOptions)[]
}> = props => {
    const form = useLatestState(props.form$);

    const setAnchor = React.useCallback((anchor) => props.form$.update((values) => ({ ...values, dirty: true, options: { ...values.options, anchor } })), [props.form$]);
    const setTitle = React.useCallback((title) => props.form$.update((values) => ({ ...values, dirty: true, options: { ...values.options, title } })), [props.form$]);
    const setTargetBlank = React.useCallback((targetBlank) => props.form$.update((values) => ({ ...values, dirty: true, options: { ...values.options, targetBlank } })), [props.form$]);
    const setRelNofollow = React.useCallback((relNofollow) => props.form$.update((values) => ({ ...values, dirty: true, options: { ...values.options, relNofollow } })), [props.form$]);

    return (
        <Layout.Stack>
            {props.enabledLinkOptions.includes('anchor') || props.enabledLinkOptions.includes('title') ? (
                <Layout.Columns>
                    {props.enabledLinkOptions.includes('anchor') ? (
                        <label>
                            {translate('Neos.Neos.Ui:LinkEditor.Main:options.label.anchor', '')}:
                            <TextInput type="text" value={form.options?.anchor ?? ""} onChange={setAnchor} />
                        </label>
                    ) : null}
                    {props.enabledLinkOptions.includes('title') ? (
                        <label>
                            {translate('Neos.Neos.Ui:LinkEditor.Main:options.label.title', '')}:
                            <TextInput type="text" value={form.options?.title ?? ""} onChange={setTitle} />
                        </label>
                    ) : null}
                </Layout.Columns>
            ) : null}
            {props.enabledLinkOptions.includes('targetBlank') || props.enabledLinkOptions.includes('relNofollow') ? (
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
                </Layout.Columns>
            ) : null}
        </Layout.Stack>
    );
}
