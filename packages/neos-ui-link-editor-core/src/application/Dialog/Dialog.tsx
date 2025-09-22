import * as React from 'react';

import {Button} from '@neos-project/react-ui-components';

import {ErrorBoundary, ErrorView} from '@neos-project/neos-ui-error';

import {
    ILink,
    ILinkOptions,
    useLinkTypeForHref,
    useSortedAndFilteredLinkTypes,
    IEditor,
    ILinkType,
} from '../../domain';
import {Layout, Form, Modal, Tabs, Deletable} from '../../presentation';

import {LinkOptions} from './LinkOptions';
import {useLatestState} from '@neos-project/framework-observable-react';
import {useSelector} from '@neos-project/neos-ui-redux-store';
import {translate} from "@neos-project/neos-ui-i18n";
import {createState, State} from "@neos-project/framework-observable";

export type FormValues = {
    isOptionsDirty: boolean
    initialLinkWasDeleted: boolean
    activeLinkTypeId: string
    options: ILinkOptions
}

type LinkModelStates = {[linkTypeId: string]: State<any>};

export const createDialog = (editor: IEditor) => () => {
    const {isOpen, initialValue} = useLatestState(editor.state$);

    if (isOpen) {
        return <ActiveLinkEditorDialog editor={editor} initialValue={initialValue} />;
    }

    return null;
};

const ActiveLinkEditorDialog: React.FC<{
    editor: IEditor
    initialValue: ILink | null
}> = ({editor, initialValue}) => {
    const {dismiss, apply, unset} = editor.transactions;

    const initialLinkType = useLinkTypeForHref(initialValue?.href ?? null);

    const availableLinkTypes = useSortedAndFilteredLinkTypes(editor);

    const form$ = React.useMemo(() => createState({
        isOptionsDirty: false,
        initialLinkWasDeleted: false,
        activeLinkTypeId: availableLinkTypes[0].id,
        options: {}
    } as FormValues), []);

    const setActiveTab = React.useCallback((linkId) => form$.update((values) => ({ ...values, activeLinkTypeId: linkId })), []);

    const form = useLatestState(form$);

    const linkModels$ = React.useMemo(() => availableLinkTypes.reduce((carry, value) => ({ ...carry, [value.id]: createState(null) }), {} as LinkModelStates), []);

    const [formStatus, setFormStatus] = React.useState<{ isDirty: boolean, isValid: boolean }>({ isDirty: false, isValid: false });

    const linkModels = Object.fromEntries(Object.entries(linkModels$).map(([linkId, linkModel$]) => [linkId, useLatestState(linkModel$)]))

    React.useEffect(() => {
        const linkType = availableLinkTypes.find(linkType => linkType.id === form.activeLinkTypeId);
        if (!linkType) {
            return; // should not happen
        }

        const model = linkModels[form.activeLinkTypeId];

        setFormStatus({
            isDirty: form.isOptionsDirty || (model ? linkType.isDirty(model) : false),
            isValid: model ? linkType.isValid(model) : false
        });
    }, [form, ...Object.values(linkModels)]);

    const unsetLinkModels = React.useCallback(() => {
        for (const linkModel$ of Object.values(linkModels$)) {
            linkModel$.update(() => null);
        }
        if (initialValue && !form$.current.initialLinkWasDeleted) {
            form$.update((values) => ({ ...values, initialLinkWasDeleted: true }));
        }
    }, []);

    const handleSubmit = React.useCallback(() => {
        const form = form$.current;
        if (!form) {
            return;
        }

        const linkType = availableLinkTypes.find(linkType => linkType.id === form.activeLinkTypeId);
        if (!linkType) {
            return; // should not happen
        }

        const linkTypeModel = linkModels$[form.activeLinkTypeId]?.current;

        if (linkTypeModel && (linkType.isDirty(linkTypeModel) || form.isOptionsDirty) && linkType.isValid(linkTypeModel)) {
            const link = {
                ...linkType.convertModelToLink(linkTypeModel),
                options: linkType.supportedLinkOptions.reduce((carry, key) => ({ ...carry, [key]: form.options?.[key] }), {})
            };
            apply(link);
        } else if(form.initialLinkWasDeleted) {
            unset();
        } else {
            console.error('NeosUi LinkEditor: Nothing to do, handleSubmit should not have been invoked.');
        }
    }, []);

    const isAuthenticated = useSelector(state => !state.system?.authenticationTimeout);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Modal
            preventClosing={formStatus.isDirty}
            onRequestClose={dismiss}
            renderTitle={() => (
                <div>{translate('Neos.Neos.Ui:LinkEditor.Main:dialog.title', '')}</div>
            )}
            renderBody={() => (
                <ErrorBoundary errorFallback={ErrorView}>
                    <Form
                        renderBody={() => (initialValue === null || initialLinkType === null) || form.initialLinkWasDeleted ? (
                            <DialogWithEmptyValue
                                form$={form$}
                                linkModels$={linkModels$}
                                editor={editor}
                                unsetLinkModels={unsetLinkModels}
                                setActiveTab={setActiveTab}
                                availableLinkTypes={availableLinkTypes}
                            />
                        ) : (
                            <DialogWithValue
                                form$={form$}
                                linkModels$={linkModels$}
                                editor={editor}
                                initialValue={initialValue}
                                initialLinkType={initialLinkType}
                                unsetLinkModels={unsetLinkModels}
                                setActiveTab={setActiveTab}
                                availableLinkTypes={availableLinkTypes}
                            />
                        )}
                    />
                </ErrorBoundary>
            )}
            actions={[
                <Button onClick={dismiss}>
                    {translate('Neos.Neos.Ui:LinkEditor.Main:dialog.action.cancel', '')}
                </Button>,
                <Button
                    style="success"
                    type="submit"
                    disabled={!form.initialLinkWasDeleted && (!formStatus.isDirty || !formStatus.isValid)}
                    onClick={handleSubmit}
                >
                    {translate('Neos.Neos.Ui:LinkEditor.Main:dialog.action.apply', '')}
                </Button>
            ]}
        />
    )
}

const DialogWithEmptyValue: React.FC<{
    form$: State<FormValues>
    linkModels$: LinkModelStates
    editor: IEditor,
    unsetLinkModels: () => void,
    setActiveTab: (linkId: string) => void,
    availableLinkTypes: ReadonlyArray<ILinkType>
}> = props => {
    const form = useLatestState(props.form$);

    const {enabledLinkOptions, editorOptions} = useLatestState(props.editor.state$);

    return (
        <Tabs
            lazy
            from={props.availableLinkTypes}
            activeItemKey={form.activeLinkTypeId}
            onSwitchTab={props.setActiveTab}
            getKey={linkType => linkType.id}
            renderHeader={({id, TabHeader}) => (
                <TabHeader
                    options={editorOptions.linkTypes?.[id] as any ?? {}}
                />
            )}
            renderPanel={linkType => {
                const {Editor} = linkType;
                const model$ = props.linkModels$[linkType.id];

                return (
                    <Layout.Stack>
                        <PreviewForLinkType
                            linkType={linkType}
                            options={editorOptions.linkTypes?.[linkType.id] as any ?? {}}
                            model$={model$}
                            onDelete={props.unsetLinkModels}
                        />

                        <ErrorBoundary errorFallback={ErrorView}>
                            <Editor
                                model$={model$}
                                options={editorOptions.linkTypes?.[linkType.id] as any ?? {}}
                            />
                        </ErrorBoundary>

                        {enabledLinkOptions.length && linkType.supportedLinkOptions.length ? (
                            <LinkOptions
                                form$={props.form$}
                                enabledLinkOptions={enabledLinkOptions.filter(
                                    option => linkType.supportedLinkOptions.includes(option)
                                )}
                            />
                        ) : null}
                    </Layout.Stack>
                )
            }}
        />
    );
}

const DialogWithValue: React.FC<{
    form$: State<FormValues>
    linkModels$: LinkModelStates
    editor: IEditor,
    initialValue: ILink,
    initialLinkType: ILinkType,
    unsetLinkModels: () => void,
    setActiveTab: (linkId: string) => void,
    availableLinkTypes: ReadonlyArray<ILinkType>
}> = props => {
    const {enabledLinkOptions, editorOptions} = useLatestState(props.editor.state$);
    const {isLoading, error, value: initialModel} = props.initialLinkType.useResolvedModel(props.initialValue);

    const form = useLatestState(props.form$);

    React.useEffect(() => {
        if (initialModel !== null) {
            const model$ = props.linkModels$[props.initialLinkType.id];
            if (!model$.current) {
                // update state with initial value once available
                model$.update(() => initialModel);
                props.form$.update((values) => ({ ...values, options: props.initialValue.options ?? {}, activeLinkTypeId: props.initialLinkType.id }));
            }
        }
    }, [initialModel]);

    const InitialPreview = props.initialLinkType.Preview;
    const InitialLoadingPreview = props.initialLinkType.LoadingPreview;

    return (
        <Tabs
            lazy
            from={props.availableLinkTypes}
            activeItemKey={form.activeLinkTypeId}
            onSwitchTab={props.setActiveTab}
            getKey={linkType => linkType.id}
            renderHeader={({id, TabHeader}) => (
                <TabHeader
                    options={editorOptions.linkTypes?.[id] as any ?? {}}
                />
            )}
            renderPanel={linkType => {
                const {Editor, LoadingEditor} = linkType;
                const model$ = props.linkModels$[linkType.id];

                return (
                    <Layout.Stack>
                        <PreviewForLinkType
                            linkType={linkType}
                            options={editorOptions.linkTypes?.[linkType.id] as any ?? {}}
                            model$={model$}
                            onDelete={props.unsetLinkModels}
                            fallback={() => (
                                error ? (
                                    <ErrorView error={error} />
                                ) : (
                                    isLoading ? (
                                        <InitialLoadingPreview
                                            link={props.initialValue}
                                            options={editorOptions.linkTypes?.[props.initialLinkType.id] as any ?? {}}
                                        />
                                    ) : (
                                        <InitialPreview
                                            model={initialModel}
                                            options={editorOptions.linkTypes?.[props.initialLinkType.id] as any ?? {}}
                                        />
                                    )
                                )
                            )}
                        />

                        <ErrorBoundary errorFallback={ErrorView}>
                            {isLoading && linkType.id === props.initialLinkType.id ? (
                                <LoadingEditor
                                    link={props.initialValue}
                                    options={editorOptions.linkTypes?.[props.initialLinkType.id] as any ?? {}}
                                />
                            ) : (
                                <Editor
                                    model$={model$}
                                    options={editorOptions.linkTypes?.[linkType.id] as any ?? {}}
                                />
                            )}
                        </ErrorBoundary>

                        {enabledLinkOptions.length && linkType.supportedLinkOptions.length ? (
                            <LinkOptions
                                form$={props.form$}
                                enabledLinkOptions={enabledLinkOptions.filter(
                                    option => linkType.supportedLinkOptions.includes(option)
                                )}
                            />
                        ) : null}
                    </Layout.Stack>
            )}}
        />
    );
}

const PreviewForLinkType: React.FC<{
    linkType: ILinkType,
    options: any,
    model$: State<any>
    onDelete: () => void,
    fallback?: () => React.ReactNode
}> = props => {
    const {Preview} = props.linkType;

    const model = useLatestState(props.model$);

    return model && props.linkType.isDirty(model) && props.linkType.isValid(model) ? (
        <Deletable
            onDelete={props.onDelete}
        >
            <ErrorBoundary errorFallback={ErrorView}>
                <Preview
                    model={model}
                    options={props.options}
                />
            </ErrorBoundary>
        </Deletable>
    ) : (props.fallback ? (
        <Deletable
            onDelete={props.onDelete}
        >
            <ErrorBoundary errorFallback={ErrorView}>
                {props.fallback()}
            </ErrorBoundary>
        </Deletable>
    ) : null);
};
