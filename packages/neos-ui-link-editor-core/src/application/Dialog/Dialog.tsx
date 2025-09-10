import * as React from 'react';
import {Form, useForm} from 'react-final-form';
import {useKey} from 'react-use';

import {Button} from '@neos-project/react-ui-components';

import {useI18n, useSelector} from '@neos-project/neos-ui-link-editor-neos-bridge';
import {ErrorBoundary} from '@neos-project/neos-ui-link-editor-error-handling';

import {Field} from '../../framework';
import {
    ILink,
    ILinkOptions,
    useLinkTypes,
    useLinkTypeForHref,
    useSortedAndFilteredLinkTypes,
    IEditor
} from '../../domain';
import {Layout, Form as StyledForm, Modal, Tabs, Deletable as Deletable} from '../../presentation';

import {LinkEditor} from './LinkEditor';
import {Settings} from './Settings';
import {useLatestState} from "@neos-project/framework-observable-react";

export const createDialog = (editor: IEditor) => () => {
    const i18n = useI18n();
    const linkTypes = useLinkTypes();
    const isAuthenticated = useSelector(state => !state.system?.authenticationTimeout);
    const {dismiss, apply, unset} = editor.transactions;
    const {isOpen, initialValue} = useLatestState(editor.state$);
    const [valueWasDeleted, setValueWasDeleted] = React.useState(false);
    const handleSubmit = React.useCallback((values: any) => {
        const linkType = linkTypes.find(linkType => linkType.id === values.linkTypeId);

        if (linkType) {
            const props = values.linkTypeProps?.[linkType.id.split('.').join('_')];

            if (props) {
                const link = {
                    ...linkType.convertModelToLink(props),
                    options: values.options
                        ? (Object.keys(values.options as ILinkOptions) as (keyof ILinkOptions)[])
                            .filter(key => linkType.supportedLinkOptions.includes(key))
                            .reduce((obj: ILinkOptions, key) => {
                                obj[key] = values.options[key];
                                return obj;
                            }, {} as ILinkOptions)
                        : {}
                };
                apply(link);
                setValueWasDeleted(false);
            }
        } else if(valueWasDeleted) {
            unset();
            setValueWasDeleted(false);
        }
    }, [linkTypes, valueWasDeleted]);

    useKey('Escape', dismiss);

    if (isOpen && isAuthenticated) {
        return (
            <Modal
                renderTitle={() => (
                    <div>{i18n('Neos.Neos.Ui:LinkEditor.Main:dialog.title')}</div>
                )}
                renderBody={() => (
                    <Form<ILinkOptions> onSubmit={handleSubmit}>
                        {({handleSubmit, valid, dirty}) => (
                            <ErrorBoundary>
                                <StyledForm
                                    renderBody={() => initialValue === null || valueWasDeleted ? (
                                        <DialogWithEmptyValue
                                            editor={editor}
                                            valid={valid}
                                            onDelete={() => setValueWasDeleted(true)}
                                        />
                                    ) : (
                                        <DialogWithValue
                                            editor={editor}
                                            value={initialValue}
                                            onDelete={() => setValueWasDeleted(true)}
                                        />
                                    )}
                                    renderActions={() => (
                                        <>
                                            <Button onClick={dismiss}>
                                                {i18n('Neos.Neos.Ui:LinkEditor.Main:dialog.action.cancel')}
                                            </Button>
                                            {(!valid || !dirty) && valueWasDeleted ? (
                                                <Button
                                                    style="success"
                                                    type="button"
                                                    onClick={unset}
                                                >
                                                    {i18n('Neos.Neos.Ui:LinkEditor.Main:dialog.action.apply')}
                                                </Button>
                                            ) : (
                                                <Button
                                                    style="success"
                                                    type="submit"
                                                    disabled={!valid || !dirty}
                                                >
                                                    {i18n('Neos.Neos.Ui:LinkEditor.Main:dialog.action.apply')}
                                                </Button>
                                            )}
                                        </>
                                    )}
                                    onSubmit={handleSubmit}
                                />
                            </ErrorBoundary>
                        )}
                    </Form>
                )}
            />
        )
    }

    if (valueWasDeleted) {
        setValueWasDeleted(false);
    }

    return null;
};

const DialogWithEmptyValue: React.FC<{
    editor: IEditor,
    valid: boolean,
    onDelete: () => void,
}> = props => {
    const form = useForm();
    const {enabledLinkOptions, editorOptions} = useLatestState(props.editor.state$);
    const sortedAndFilteredLinkTypes = useSortedAndFilteredLinkTypes(props.editor);

    return (
        <Field name="linkTypeId" initialValue={sortedAndFilteredLinkTypes[0]?.id}>{({input}) => (
            <Tabs
                lazy
                from={sortedAndFilteredLinkTypes}
                activeItemKey={input.value}
                getKey={linkType => linkType.id}
                renderHeader={({id, TabHeader}) => (
                    <TabHeader
                        options={editorOptions.linkTypes?.[id] as any ?? {}}
                    />
                )}
                renderPanel={linkType => {
                    const {Preview} = linkType;
                    const model = form.getState().values.linkTypeProps?.[linkType.id.split('.').join('_')];

                    return (
                        <Layout.Stack>
                            {props.valid && model ? (
                                <Deletable
                                    onDelete={() => {
                                        props.onDelete();
                                        form.change('linkTypeProps', null);
                                    }}
                                >
                                    <ErrorBoundary>
                                        <Preview
                                            model={form.getState().values.linkTypeProps?.[linkType.id.split('.').join('_')]}
                                            options={editorOptions.linkTypes?.[linkType.id] as any ?? {}}
                                            link={{href: ''}}
                                        />
                                    </ErrorBoundary>
                                </Deletable>
                            ) : null}

                            <div style={{ overflow: "auto" }}>
                            <LinkEditor
                                editor={props.editor}
                                key={linkType.id}
                                link={null}
                                linkType={linkType}
                            />

                            {enabledLinkOptions.length && linkType.supportedLinkOptions.length ? (
                                <Settings
                                    enabledLinkOptions={enabledLinkOptions.filter(
                                        option => linkType.supportedLinkOptions.includes(option)
                                    )}
                                />
                            ) : null}
                            </div>
                        </Layout.Stack>
                    )
                }}
                onSwitchTab={input.onChange}
            />
        )}</Field>
    );
}

const DialogWithValue: React.FC<{
    editor: IEditor,
    value: ILink,
    onDelete: () => void,
}> = props => {
    const form = useForm();
    const {enabledLinkOptions, editorOptions} = useLatestState(props.editor.state$);
    const linkType = useLinkTypeForHref(props.value.href)!;
    const {result} = linkType.useResolvedModel(props.value);
    const exitingPreview = linkType.Preview;
    const state = form.getState();
    const existingModel = (state.valid
        ? state.values.linkTypeProps?.[linkType.id.split('.').join('_')]
        : result) ?? result;
    const sortedAndFilteredLinkTypes = useSortedAndFilteredLinkTypes(props.editor);

    return (
        <Field name="linkTypeId" initialValue={sortedAndFilteredLinkTypes[0]?.id}>{({input}) => (
            <Tabs
                lazy
                from={sortedAndFilteredLinkTypes}
                activeItemKey={input.value || linkType.id}
                getKey={linkType => linkType.id}
                renderHeader={({id, TabHeader}) => (
                    <TabHeader
                        options={editorOptions.linkTypes?.[id] as any ?? {}}
                    />
                )}
                renderPanel={linkType => {
                    const modelFromState = form.getState().values.linkTypeProps?.[linkType.id.split('.').join('_')]
                    let Preview = linkType.Preview;
                    let model = modelFromState;
                    if (!modelFromState || (linkType.id === 'Sitegeist.Archaeopteryx:Web' && !modelFromState?.urlWithoutProtocol) || (linkType.id === 'Sitegeist.Archaeopteryx:PhoneNumber' && !modelFromState?.phoneNumber) || (linkType.id === 'Sitegeist.Archaeopteryx:CustomLink' && !modelFromState?.CustomLink)) {
                        Preview = exitingPreview;
                        model = existingModel;
                    }

                    return (
                        <Layout.Stack>
                            {model ? (
                                <Deletable
                                    onDelete={() => {
                                        props.onDelete();
                                        form.change('linkTypeProps', null);
                                    }}
                                >
                                    <ErrorBoundary>
                                        <Preview
                                            model={model}
                                            options={editorOptions.linkTypes?.[linkType.id] as any ?? {}}
                                            link={props.value}
                                        />
                                    </ErrorBoundary>
                                </Deletable>
                            ) : null}

                            <LinkEditor
                                editor={props.editor}
                                key={linkType.id}
                                link={linkType.isSuitableFor(props.value) ? props.value : null}
                                linkType={linkType}
                            />

                            {enabledLinkOptions.length && linkType.supportedLinkOptions.length ? (
                                <Settings
                                    initialValue={props.value.options}
                                    enabledLinkOptions={enabledLinkOptions.filter(
                                        option => linkType.supportedLinkOptions.includes(option)
                                    )}
                                />
                            ) : null}
                        </Layout.Stack>
                )}}
                onSwitchTab={input.onChange}
            />
        )}</Field>
    );
}
