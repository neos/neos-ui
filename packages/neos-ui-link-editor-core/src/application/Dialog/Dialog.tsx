import * as React from 'react';

import {Button} from '@neos-project/react-ui-components';

import {ErrorBoundary, ErrorView} from '@neos-project/neos-ui-error';

import {
    ILink,
    ILinkOptions,
    useLinkTypes,
    useLinkTypeForHref,
    useSortedAndFilteredLinkTypes,
    IEditor,
    ILinkType,
} from '../../domain';
import {Layout, Form, Modal, Tabs, Deletable} from '../../presentation';

import {Settings} from './Settings';
import {useLatestState} from '@neos-project/framework-observable-react';
import {useSelector} from '@neos-project/neos-ui-redux-store';
import {translate} from "@neos-project/neos-ui-i18n";
import {createState, State} from "@neos-project/framework-observable";
import {MutableRefObject} from "react";

export type FormValues = {
    isOptionsDirty: boolean
    activeLinkTypeId: string
    options: ILinkOptions
}

type LinkModelStates = {[linkTypeId: string]: State<any>};

export const createDialog = (editor: IEditor) => () => {
    const isAuthenticated = useSelector(state => !state.system?.authenticationTimeout);
    const {dismiss, apply, unset} = editor.transactions;
    const {isOpen, initialValue} = useLatestState(editor.state$);

    const formRef$ = React.useRef<null | State<FormValues>>(null);
    const linkModelsRef$ = React.useRef<null | LinkModelStates>(null);

    const linkTypes = useLinkTypes();

    const initialLinkType = useLinkTypeForHref(initialValue?.href ?? null);

    // this flag is a little faulty as it just indicates that during editing the value was deleted at any point at least once -> but not that it's the last change
    const [valueWasDeleted, setValueWasDeleted] = React.useState(false);
    const handleSubmit = React.useCallback(() => {
        const form = formRef$.current?.current;
        if (!form) {
            return;
        }

        const linkType = linkTypes.find(linkType => linkType.id === form.activeLinkTypeId);

        if (linkType) {
            const linkTypeModel = linkModelsRef$.current?.[form.activeLinkTypeId]?.current;
            if (!linkTypeModel) {
                return;
            }
            const link = {
                ...linkType.convertModelToLink(linkTypeModel),
                options: linkType.supportedLinkOptions.reduce((carry, key) => ({ ...carry, [key]: form.options?.[key] }), {})
            };
            apply(link);
            setValueWasDeleted(false);
        } else if(valueWasDeleted) {
            unset();
            setValueWasDeleted(false);
        }
    }, [linkTypes, valueWasDeleted]);

    if (isOpen && isAuthenticated) {
        return (
            <Modal
                preventClosing={false}
                onRequestClose={dismiss}
                renderTitle={() => (
                    <div>{translate('Neos.Neos.Ui:LinkEditor.Main:dialog.title', '')}</div>
                )}
                renderBody={() => (
                    <ErrorBoundary errorFallback={ErrorView}>
                        <Form
                            renderBody={() => (initialValue === null || initialLinkType === null) || valueWasDeleted ? (
                                <DialogWithEmptyValue
                                    formRef$={formRef$}
                                    linkModelsRef$={linkModelsRef$}
                                    editor={editor}
                                    activeLinkTypeId={formRef$.current?.current?.activeLinkTypeId}
                                    onDelete={() => setValueWasDeleted(true)}
                                />
                            ) : (
                                <DialogWithValue
                                    formRef$={formRef$}
                                    linkModelsRef$={linkModelsRef$}
                                    editor={editor}
                                    initialValue={initialValue}
                                    initialLinkType={initialLinkType}
                                    onDelete={() => setValueWasDeleted(true)}
                                />
                            )}
                            renderActions={() => (
                                <>
                                    <Button onClick={dismiss}>
                                        {translate('Neos.Neos.Ui:LinkEditor.Main:dialog.action.cancel', '')}
                                    </Button>
                                    {valueWasDeleted ? /* todo dont unset if there is a new value now */ (
                                        <Button
                                            style="success"
                                            type="button"
                                            onClick={unset}
                                        >
                                            {translate('Neos.Neos.Ui:LinkEditor.Main:dialog.action.apply', '')}
                                        </Button>
                                    ) : (
                                        <Button
                                            style="success"
                                            type="submit"
                                            disabled={false}
                                        >
                                            {translate('Neos.Neos.Ui:LinkEditor.Main:dialog.action.apply', '')}
                                        </Button>
                                    )}
                                </>
                            )}
                            onSubmit={handleSubmit}
                        />
                    </ErrorBoundary>
                )}
            />
        )
    }

    // cleanup state

    if (valueWasDeleted) {
        setValueWasDeleted(false);
    }

    formRef$.current = null;
    linkModelsRef$.current = null;

    return null;
};

const DialogWithEmptyValue: React.FC<{
    formRef$: MutableRefObject<null | State<FormValues>>
    linkModelsRef$: MutableRefObject<null | LinkModelStates>
    editor: IEditor,
    activeLinkTypeId?: string
    onDelete: () => void,
}> = props => {
    const {enabledLinkOptions, editorOptions} = useLatestState(props.editor.state$);
    const sortedAndFilteredLinkTypes = useSortedAndFilteredLinkTypes(props.editor);

    const form$ = React.useMemo(() => createState({
        isOptionsDirty: false,
        activeLinkTypeId: props.activeLinkTypeId ?? sortedAndFilteredLinkTypes[0].id,
        options: {}
    } as FormValues), []);

    const form = useLatestState(form$);
    const setActiveTab = React.useCallback((linkId) => form$.update((values) => ({ ...values, activeLinkTypeId: linkId })), []);

    const linkModels$ = React.useMemo(() => sortedAndFilteredLinkTypes.reduce((carry, value) => ({ ...carry, [value.id]: createState(null) }), {} as LinkModelStates), []);

    const unsetLinkModels = React.useCallback(() => {
        props.onDelete();
        for (const linkModel$ of Object.values(linkModels$)) {
            linkModel$.update(() => null);
        }
    }, []);

    props.formRef$.current = form$;
    props.linkModelsRef$.current = linkModels$;

    return (
        <Tabs
            lazy
            from={sortedAndFilteredLinkTypes}
            activeItemKey={form.activeLinkTypeId}
            onSwitchTab={setActiveTab}
            getKey={linkType => linkType.id}
            renderHeader={({id, TabHeader}) => (
                <TabHeader
                    options={editorOptions.linkTypes?.[id] as any ?? {}}
                />
            )}
            renderPanel={linkType => {
                const {Preview, Editor} = linkType;
                const model$ = linkModels$[linkType.id];

                const model = useLatestState(model$);

                return (
                    <Layout.Stack>
                        {model && linkType.isValid(model) ? (
                            <Deletable
                                onDelete={unsetLinkModels}
                            >
                                <ErrorBoundary errorFallback={ErrorView}>
                                    <Preview
                                        model={model}
                                        options={editorOptions.linkTypes?.[linkType.id] as any ?? {}}
                                    />
                                </ErrorBoundary>
                            </Deletable>
                        ) : null}

                        <ErrorBoundary errorFallback={ErrorView}>
                            <Editor
                                model$={model$}
                                options={editorOptions.linkTypes?.[linkType.id] as any ?? {}}
                            />
                        </ErrorBoundary>

                        {enabledLinkOptions.length && linkType.supportedLinkOptions.length ? (
                            <Settings
                                form$={form$}
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
    formRef$: MutableRefObject<null | State<FormValues>>
    linkModelsRef$: MutableRefObject<null | LinkModelStates>
    editor: IEditor,
    initialValue: ILink,
    initialLinkType: ILinkType,
    onDelete: () => void,
}> = props => {
    const {enabledLinkOptions, editorOptions} = useLatestState(props.editor.state$);
    const {isLoading, error, value: initialModel} = props.initialLinkType.useResolvedModel(props.initialValue);

    const sortedAndFilteredLinkTypes = useSortedAndFilteredLinkTypes(props.editor);

    const form$ = React.useMemo(() => createState({
        isOptionsDirty: false,
        activeLinkTypeId: props.initialLinkType.id,
        options: props.initialValue.options
    } as FormValues), []);

    const form = useLatestState(form$);
    const setActiveTab = React.useCallback((linkId) => form$.update((values) => ({ ...values, activeLinkTypeId: linkId })), []);

    const linkModels$ = React.useMemo(() => sortedAndFilteredLinkTypes.reduce((carry, value) => ({ ...carry, [value.id]: value.id === props.initialLinkType.id ? createState(initialModel) : createState(null) }), {} as LinkModelStates), []);

    React.useEffect(() => {
        if (initialModel !== null) {
            // set value if it is not set because model was fetched async
            const model$ = linkModels$[props.initialLinkType.id];
            if (model$ === null) {
                return;
            }
            model$.update(() => initialModel);
        }
    }, [initialModel]);

    const unsetLinkModels = React.useCallback(() => {
        props.onDelete();
        for (const linkModel$ of Object.values(linkModels$)) {
            linkModel$.update(() => null);
        }
    }, []);

    props.formRef$.current = form$;
    props.linkModelsRef$.current = linkModels$;

    const InitialPreview = props.initialLinkType.Preview;
    const InitialLoadingPreview = props.initialLinkType.LoadingPreview;

    return (
        <Tabs
            lazy
            from={sortedAndFilteredLinkTypes}
            activeItemKey={form.activeLinkTypeId}
            onSwitchTab={setActiveTab}
            getKey={linkType => linkType.id}
            renderHeader={({id, TabHeader}) => (
                <TabHeader
                    options={editorOptions.linkTypes?.[id] as any ?? {}}
                />
            )}
            renderPanel={linkType => {
                const {Preview, Editor, LoadingEditor} = linkType;
                const model$ = linkModels$[linkType.id];

                const model = useLatestState(model$);

                return (
                    <Layout.Stack>
                        {model && linkType.isDirty(model) && linkType.isValid(model) ? (
                            <Deletable
                                onDelete={unsetLinkModels}
                            >
                                <ErrorBoundary errorFallback={ErrorView}>
                                    <Preview
                                        model={model}
                                        options={editorOptions.linkTypes?.[linkType.id] as any ?? {}}
                                    />
                                </ErrorBoundary>
                            </Deletable>
                        ) : (
                            <Deletable
                                onDelete={unsetLinkModels}
                            >
                                {error ? (
                                    <ErrorView error={error} />
                                ) : (
                                    <ErrorBoundary errorFallback={ErrorView}>
                                        {isLoading ? (
                                            <InitialLoadingPreview
                                                link={props.initialValue}
                                                options={editorOptions.linkTypes?.[props.initialLinkType.id] as any ?? {}}
                                            />
                                        ) : (
                                            <InitialPreview
                                                model={initialModel}
                                                options={editorOptions.linkTypes?.[props.initialLinkType.id] as any ?? {}}
                                            />
                                        )}
                                    </ErrorBoundary>
                                )}
                            </Deletable>
                        )}

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
                            <Settings
                                form$={form$}
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
