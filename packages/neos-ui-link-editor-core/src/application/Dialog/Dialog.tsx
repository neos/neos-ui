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
import {createState, pickState, mapState, State} from "@neos-project/framework-observable";
import {PanelProps} from "@neos-project/react-ui-components/types/Tabs/panel";

export type FormValues = {
    isOptionsDirty: boolean
    initialLinkWasDeleted: boolean
    activeLinkTypeId: string
    showOptions: boolean
    options: ILinkOptions,
    linkModels: {
        [linkTypeId: string]: any
    }
}

// @ts-ignore "Panel" is not visible to typescript
const TabsPanel: React.FC<PanelProps> = Tabs.Panel;

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

    // todo link type might not be available if disabled but returned here...
    const initialLinkType = useLinkTypeForHref(initialValue?.href ?? null);

    const availableLinkTypes = useSortedAndFilteredLinkTypes(editor);

    const form$ = React.useMemo(() => createState({
        isOptionsDirty: false,
        showOptions: Object.values(initialValue?.options ?? {}).some(Boolean),
        initialLinkWasDeleted: false,
        activeLinkTypeId: initialLinkType?.id ?? availableLinkTypes[0].id,
        options: initialValue?.options ?? {},
        linkModels: {}
    } as FormValues), []);

    const formStatus$ = React.useMemo(() => mapState(form$, (form) => {
        const linkType = availableLinkTypes.find(l => l.id === form.activeLinkTypeId);
        if (!linkType) {
            throw Error(`Fatal: Link type ${form.activeLinkTypeId} does no longer exist.`)
        }

        const model = form.linkModels[form.activeLinkTypeId];

        return {
            isDirty: form.isOptionsDirty || (model ? linkType.isDirty(model) : false),
            isValid: model ? linkType.isValid(model) : false,
            initialLinkWasDeleted: form.initialLinkWasDeleted,
        };
    }), []);

    const formStatus = useLatestState(formStatus$);

    const handleSubmit = React.useCallback(() => {
        const form = form$.current;
        if (!form) {
            return;
        }

        const linkType = availableLinkTypes.find(linkType => linkType.id === form.activeLinkTypeId);
        if (!linkType) {
            throw Error(`Fatal: Link type ${form.activeLinkTypeId} does no longer exist.`)
        }

        const linkTypeModel = form$.current.linkModels[form.activeLinkTypeId];

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
            title={<div>{translate('Neos.Neos.Ui:LinkEditor.Main:dialog.title', '')}</div>}
            renderBody={() => (
                <ErrorBoundary errorFallback={ErrorView}>
                    <Form>
                        {(initialValue === null || initialLinkType === null) || formStatus.initialLinkWasDeleted ? (
                            <DialogWithEmptyValue
                                form$={form$}
                                editor={editor}
                                availableLinkTypes={availableLinkTypes}
                            />
                        ) : (
                            <DialogWithValue
                                form$={form$}
                                editor={editor}
                                initialValue={initialValue}
                                initialLinkType={initialLinkType}
                                availableLinkTypes={availableLinkTypes}
                            />
                        )}
                    </Form>
                </ErrorBoundary>
            )}
            actions={[
                <Button onClick={dismiss}>
                    {translate('Neos.Neos.Ui:LinkEditor.Main:dialog.action.cancel', '')}
                </Button>,
                <Button
                    style="success"
                    type="submit"
                    disabled={!formStatus.initialLinkWasDeleted && (!formStatus.isDirty || !formStatus.isValid)}
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
    editor: IEditor,
    availableLinkTypes: ReadonlyArray<ILinkType>
}> = props => {
    const setActiveTab = React.useCallback((linkId) => props.form$.update((values) => ({...values, activeLinkTypeId: linkId})), []);
    const activeTab$ = React.useMemo(() => mapState(props.form$, (form) => form.activeLinkTypeId), []);
    const activeTab = useLatestState(activeTab$);

    const {editorOptions} = useLatestState(props.editor.state$);

    const linkModels$ = React.useMemo(() => pickState(props.form$, 'linkModels'), []);

    return (<>
        <PreviewForLinkType
            availableLinkTypes={props.availableLinkTypes}
            editor={props.editor}
            form$={props.form$}
        />
        <Tabs
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
        >
            {props.availableLinkTypes.map((linkType) => {
                const {Editor} = linkType;
                const model$ = React.useMemo(() => pickState(linkModels$, linkType.id), [linkModels$])
                const options = editorOptions.linkTypes?.[linkType.id] as any ?? {};

                return (
                    <TabsPanel
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
                    </TabsPanel>
                )
            })}
        </Tabs>
    </>);
}

const DialogWithValue: React.FC<{
    form$: State<FormValues>
    editor: IEditor,
    initialValue: ILink,
    initialLinkType: ILinkType,
    availableLinkTypes: ReadonlyArray<ILinkType>
}> = props => {
    const {editorOptions} = useLatestState(props.editor.state$);
    const {isLoading, error, value: initialModel} = props.initialLinkType.useResolvedModel(props.initialValue);

    const setActiveTab = React.useCallback((linkId) => props.form$.update((values) => ({...values, activeLinkTypeId: linkId})), []);
    const activeTab$ = React.useMemo(() => mapState(props.form$, (form) => form.activeLinkTypeId), []);
    const activeTab = useLatestState(activeTab$);

    React.useEffect(() => {
        if (initialModel !== null) {
            if (!props.form$.current.linkModels[props.initialLinkType.id]) {
                // update state with initial value once available
                props.form$.update((form) => ({
                    ...form,
                    linkModels: {
                        ...form.linkModels,
                        [props.initialLinkType.id]: initialModel
                    }
                }));
            }
        }
    }, [initialModel]);

    const linkModels$ = React.useMemo(() => pickState(props.form$, 'linkModels'), []);

    const InitialPreview = props.initialLinkType.Preview;
    const InitialLoadingPreview = props.initialLinkType.LoadingPreview;

    return (
        <>
            <PreviewForLinkType
                editor={props.editor}
                initialLinkType={props.initialLinkType}
                availableLinkTypes={props.availableLinkTypes}
                form$={props.form$}
                initialLinkTypePreview={() => (
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
                activeTab={activeTab}
                onActiveTabChange={setActiveTab}
            >
                {props.availableLinkTypes.map((linkType) => {
                    const {Editor, LoadingEditor} = linkType;
                    const model$ = React.useMemo(() => pickState(linkModels$, linkType.id), [linkModels$])

                    return (
                        <TabsPanel
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
                        </TabsPanel>
                    )
                })}
            </Tabs>
        </>
    );
}

const PreviewForLinkType: React.FC<{
    editor: IEditor,
    availableLinkTypes: ReadonlyArray<ILinkType>
    initialLinkType?: ILinkType,
    form$: State<FormValues>
    initialLinkTypePreview?: () => React.ReactNode
}> = props => {
    const {enabledLinkOptions, editorOptions} = useLatestState(props.editor.state$);

    const formHeader$ = React.useMemo(() => mapState(props.form$, (form) => {
        const linkType = props.availableLinkTypes.find(l => l.id === form.activeLinkTypeId);
        if (!linkType) {
            throw Error(`Fatal: Link type ${form.activeLinkTypeId} does no longer exist.`)
        }

        const activeModel = form.linkModels[form.activeLinkTypeId];

        const showPreviewForEditedActiveLink = activeModel && linkType.isDirty(activeModel) && linkType.isValid(activeModel);

        return {
            activeModel,
            activeLinkType: linkType,
            showPreviewForEditedActiveLink: showPreviewForEditedActiveLink,
            showOptions: form.showOptions,
            isOptionsDirty: form.isOptionsDirty,
            disableOptions: !form.initialLinkWasDeleted && props.initialLinkType
                ? (showPreviewForEditedActiveLink ? false : form.activeLinkTypeId !== props.initialLinkType?.id)
                : false
        }
    }), []);

    const unsetLinkModels = React.useCallback(() => {
        props.form$.update((values) => ({
            ...values,
            isOptionsDirty: false,
            showOptions: false,
            options: {},
            initialLinkWasDeleted: Boolean(props.initialLinkType),
            linkModels: {}
        }));
    }, []);

    const formHeader = useLatestState(formHeader$);

    const {Preview} = formHeader.activeLinkType;

    const toggleOptions = React.useCallback(() => props.form$.update((values) => ({
        ...values,
        showOptions: !values.showOptions
    })), []);

    return <div style={{marginBottom: "16px"}}>
        <div style={{display: "flex"}}>
            {formHeader.showPreviewForEditedActiveLink ? (
                <Deletable
                    id={'neos-LinkEditor-Preview'}
                    onDelete={unsetLinkModels}
                >
                    <ErrorBoundary errorFallback={ErrorView}>
                        <Preview
                            model={formHeader.activeModel}
                            options={editorOptions.linkTypes?.[formHeader.activeLinkType.id] as any ?? {}}
                        />
                    </ErrorBoundary>
                </Deletable>
            ) : (props.initialLinkTypePreview ? (
                <Deletable
                    id={'neos-LinkEditor-Preview'}
                    onDelete={unsetLinkModels}
                >
                    <ErrorBoundary errorFallback={ErrorView}>
                        {props.initialLinkTypePreview()}
                    </ErrorBoundary>
                </Deletable>
            ) : null)}

            <div style={{marginLeft: "auto", alignSelf: "center"}}>
                {(formHeader.showPreviewForEditedActiveLink || props.initialLinkType) ? (
                    <IconButton id={'neos-LinkEditor-Options'} icon="cogs" style={formHeader.isOptionsDirty ? "warn" : "neutral"} disabled={!enabledLinkOptions.length || formHeader.disableOptions} isActive={formHeader.showOptions} onClick={toggleOptions}/>
                ) : null}
            </div>
        </div>

        {(formHeader.showPreviewForEditedActiveLink || props.initialLinkType) && enabledLinkOptions.length && formHeader.showOptions && !formHeader.disableOptions ? (
            <LinkOptions
                form$={props.form$}
                enabledLinkOptions={enabledLinkOptions}
            />
        ) : null}
    </div>;
};
