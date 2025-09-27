import * as React from 'react';

import {Button, IconButton, Tabs} from '@neos-project/react-ui-components';

import {ErrorBoundary, ErrorView} from '@neos-project/neos-ui-error';

import {
    ILink,
    ILinkOptions,
    useLinkTypeForHref,
    useSortedAndFilteredLinkTypes,
    IEditor,
    ILinkType,
} from '../../domain';
import {Layout, Form, Modal, Deletable} from '../../presentation';

import {LinkOptions} from './LinkOptions';
import {useLatestState} from '@neos-project/framework-observable-react';
import {useSelector} from '@neos-project/neos-ui-redux-store';
import {translate} from "@neos-project/neos-ui-i18n";
import {createState, State} from "@neos-project/framework-observable";
import {pick} from "@neos-project/framework-observable/src/State";

export type FormValues = {
    isOptionsDirty: boolean
    initialLinkWasDeleted: boolean
    activeLinkTypeId: string
    showOptions: boolean
    disableOptions: boolean
    options: ILinkOptions
}

type LinkModelsState = State<{ [linkTypeId: string]: any }>;

export const createDialog = (editor: IEditor) => () => {
    const {isOpen, initialValue} = useLatestState(editor.state$);

    if (isOpen) {
        return <ActiveLinkEditorDialog editor={editor} initialValue={initialValue}/>;
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
        showOptions: Object.values(initialValue?.options ?? {}).some(Boolean),
        disableOptions: false,
        initialLinkWasDeleted: false,
        activeLinkTypeId: initialLinkType?.id ?? availableLinkTypes[0].id,
        options: initialValue?.options ?? {}
    } as FormValues), []);

    // todo enable form options when current tab has dirty changes
    const setActiveTab = React.useCallback((linkId) => form$.update((values) => ({
        ...values,
        activeLinkTypeId: linkId,
        disableOptions: !values.initialLinkWasDeleted && initialLinkType ? linkId !== initialLinkType.id : false
    })), []);

    const form = useLatestState(form$);

    const linkModels$ = React.useMemo(() => createState({}) as LinkModelsState, []);

    const [formStatus, setFormStatus] = React.useState<{ isDirty: boolean, isValid: boolean }>({ isDirty: false, isValid: false });

    const linkModels = useLatestState(linkModels$);

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
    }, [form, linkModels]);

    const unsetLinkModels = React.useCallback(() => {
        linkModels$.update(() => ({}));
        form$.update((values) => ({
            ...values,
            isOptionsDirty: false,
            showOptions: false,
            disableOptions: false,
            options: {},
            initialLinkWasDeleted: Boolean(initialValue)
        }));
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

        const linkTypeModel = linkModels$.current[form.activeLinkTypeId];

        if (linkTypeModel && (linkType.isDirty(linkTypeModel) || form.isOptionsDirty) && linkType.isValid(linkTypeModel)) {
            const link = {
                href: linkType.convertModelToLink(linkTypeModel).href,
                options: form.options

            };
            apply(link);
        } else if (form.initialLinkWasDeleted) {
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
    linkModels$: LinkModelsState
    editor: IEditor,
    unsetLinkModels: () => void,
    setActiveTab: (linkId: string) => void,
    availableLinkTypes: ReadonlyArray<ILinkType>
}> = props => {
    const form = useLatestState(props.form$);

    const {enabledLinkOptions, editorOptions} = useLatestState(props.editor.state$);

    const linkType = React.useMemo(() => props.availableLinkTypes.find((l) => l.id === form.activeLinkTypeId), [form])!;
    const model$ = React.useMemo(() => pick(props.linkModels$, form.activeLinkTypeId), [props.linkModels$, form])

    return (<>
        <PreviewForLinkType
            linkType={linkType}
            options={editorOptions.linkTypes?.[linkType.id] as any ?? {}}
            model$={model$}
            onDelete={props.unsetLinkModels}
            form$={props.form$}
            enabledLinkOptions={enabledLinkOptions}
        />
        <Tabs
            activeTab={form.activeLinkTypeId}
            onActiveTabChange={props.setActiveTab}
        >
            {props.availableLinkTypes.map((linkType) => {
                const {Editor} = linkType;
                const model$ = React.useMemo(() => pick(props.linkModels$, linkType.id), [props.linkModels$])
                const options = editorOptions.linkTypes?.[linkType.id] as any ?? {};

                return (
                    <Tabs.Panel
                        key={linkType.id}
                        id={linkType.id}
                        // menu item props
                        title={linkType.getTitle()}
                        icon={linkType.icon}
                    >
                        <Layout.Stack>
                            <ErrorBoundary errorFallback={ErrorView}>
                                <Editor model$={model$} options={options}/>
                            </ErrorBoundary>
                        </Layout.Stack>
                    </Tabs.Panel>
                )
            })}
        </Tabs>
    </>);
}

const DialogWithValue: React.FC<{
    form$: State<FormValues>
    linkModels$: LinkModelsState
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
            if (!props.linkModels$.current[props.initialLinkType.id]) {
                // update state with initial value once available
                props.linkModels$.update((values) => ({
                    ...values,
                    [props.initialLinkType.id]: initialModel
                }));
            }
        }
    }, [initialModel]);

    const InitialPreview = props.initialLinkType.Preview;
    const InitialLoadingPreview = props.initialLinkType.LoadingPreview;

    const linkType = React.useMemo(() => props.availableLinkTypes.find((l) => l.id === form.activeLinkTypeId), [form])!;
    const model$ = React.useMemo(() => pick(props.linkModels$, form.activeLinkTypeId), [props.linkModels$, form])

    return (
        <>
            <PreviewForLinkType
                linkType={linkType}
                options={editorOptions.linkTypes?.[linkType.id] as any ?? {}}
                model$={model$}
                onDelete={props.unsetLinkModels}
                form$={props.form$}
                enabledLinkOptions={enabledLinkOptions}
                fallback={() => (
                    error ? (
                        <ErrorView error={error}/>
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
            <Tabs
                activeTab={form.activeLinkTypeId}
                onActiveTabChange={props.setActiveTab}
            >
                {props.availableLinkTypes.map((linkType) => {
                    const {Editor, LoadingEditor} = linkType;
                    const model$ = React.useMemo(() => pick(props.linkModels$, linkType.id), [props.linkModels$])

                    return (
                        <Tabs.Panel
                            key={linkType.id}
                            id={linkType.id}
                            // menu item props
                            title={linkType.getTitle()}
                            icon={linkType.icon}
                        >
                            <Layout.Stack>
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

                            </Layout.Stack>
                        </Tabs.Panel>
                    )
                })}
            </Tabs>
        </>
    );
}

const PreviewForLinkType: React.FC<{
    linkType: ILinkType,
    options: any,
    model$: State<any>
    onDelete: () => void,
    form$: State<FormValues>
    enabledLinkOptions: (keyof ILinkOptions)[],
    fallback?: () => React.ReactNode
}> = props => {
    const {Preview} = props.linkType;

    const toggleOptions = React.useCallback(() => props.form$.update((values) => ({
        ...values,
        showOptions: !values.showOptions
    })), []);

    const form = useLatestState(props.form$);

    const model = useLatestState(props.model$);

    const showNewLinkTypePreview = model && props.linkType.isDirty(model) && props.linkType.isValid(model);

    return <div style={{marginBottom: "16px"}}>
        <div style={{display: "flex"}}>
            {showNewLinkTypePreview ? (
                <Deletable
                    id={'neos-LinkEditor-Preview'}
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
                    id={'neos-LinkEditor-Preview'}
                    onDelete={props.onDelete}
                >
                    <ErrorBoundary errorFallback={ErrorView}>
                        {props.fallback()}
                    </ErrorBoundary>
                </Deletable>
            ) : null)}

            <div style={{marginLeft: "auto", alignSelf: "center"}}>
                {(showNewLinkTypePreview || props.fallback) ? (
                    <IconButton id={'neos-LinkEditor-Options'} icon="cogs" style={form.isOptionsDirty ? "warn" : "neutral"} disabled={!props.enabledLinkOptions.length || form.disableOptions} isActive={form.showOptions} onClick={toggleOptions}/>
                ) : null}
            </div>
        </div>

        {(showNewLinkTypePreview || props.fallback) && props.enabledLinkOptions.length && form.showOptions && !form.disableOptions ? (
            <LinkOptions
                form$={props.form$}
                enabledLinkOptions={props.enabledLinkOptions}
            />
        ) : null}
    </div>;
};
