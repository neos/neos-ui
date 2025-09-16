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

import {Settings} from './Settings';
import {useLatestState} from '@neos-project/framework-observable-react';
import {useSelector} from '@neos-project/neos-ui-redux-store';
import {translate} from "@neos-project/neos-ui-i18n";
import {createState, State} from "@neos-project/framework-observable";

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

    const initialLinkType = useLinkTypeForHref(initialValue?.href ?? null);

    // this flag is a little faulty as it just indicates that during editing the value was deleted at any point at least once -> but not that it's the last change
    const [valueWasDeleted, setValueWasDeleted] = React.useState(false);

    const availableLinkTypes = useSortedAndFilteredLinkTypes(editor);

    const form$ = React.useMemo(() => createState({
        isOptionsDirty: false,
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

        if (!model) {
            setFormStatus({
                isDirty: form.isOptionsDirty,
                isValid: false
            });
            return;
        }
        setFormStatus({
            isDirty: form.isOptionsDirty || linkType.isDirty(model),
            isValid: linkType.isValid(model)
        });
        // todo the spread breaks if the count of available link types varies
    }, [form, ...Object.values(linkModels)]);

    const unsetLinkModels = React.useCallback(() => {
        setValueWasDeleted(true);
        for (const linkModel$ of Object.values(linkModels$)) {
            linkModel$.update(() => null);
        }
    }, []);

    const handleSubmit = React.useCallback(() => {
        const form = form$.current;
        if (!form) {
            return;
        }

        const linkType = availableLinkTypes.find(linkType => linkType.id === form.activeLinkTypeId);

        if (linkType) {
            const linkTypeModel = linkModels$[form.activeLinkTypeId]?.current;
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
    }, [availableLinkTypes, valueWasDeleted]);

    if (isOpen && isAuthenticated) {
        return (
            <Modal
                preventClosing={formStatus.isDirty}
                onRequestClose={dismiss}
                renderTitle={() => (
                    <div>{translate('Neos.Neos.Ui:LinkEditor.Main:dialog.title', '')} {JSON.stringify(formStatus)}</div>
                )}
                renderBody={() => (
                    <ErrorBoundary errorFallback={ErrorView}>
                        <Form
                            renderBody={() => (initialValue === null || initialLinkType === null) || valueWasDeleted ? (
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
                    valueWasDeleted ? /* todo dont unset if there is a new value now */ (
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
                            disabled={!formStatus.isDirty || !formStatus.isValid}
                            onClick={handleSubmit}
                        >
                            {translate('Neos.Neos.Ui:LinkEditor.Main:dialog.action.apply', '')}
                        </Button>
                    )
                ]}
            />
        )
    }

    // cleanup state

    if (valueWasDeleted) {
        setValueWasDeleted(false);
    }

    // form$.update(() => ({
    //     isOptionsDirty: false,
    //     activeLinkTypeId: '',
    //     options: {}
    // }));
    // for (const linkModel$ of Object.values(linkModels$)) {
    //     linkModel$.update(() => null);
    // }

    return null;
};

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
                const {Preview, Editor} = linkType;
                const model$ = props.linkModels$[linkType.id];

                const model = useLatestState(model$);

                return (
                    <Layout.Stack>
                        {model && linkType.isValid(model) ? (
                            <Deletable
                                onDelete={props.unsetLinkModels}
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
            if (model$.current) {
                return;
            }
            // update state with initial value once available
            model$.update(() => initialModel);
            props.form$.update((values) => ({ ...values, options: initialModel.options, activeLinkTypeId: props.initialLinkType.id }));
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
                const {Preview, Editor, LoadingEditor} = linkType;
                const model$ = props.linkModels$[linkType.id];

                const model = useLatestState(model$);

                return (
                    <Layout.Stack>
                        {model && linkType.isDirty(model) && linkType.isValid(model) ? (
                            <Deletable
                                onDelete={props.unsetLinkModels}
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
                                onDelete={props.unsetLinkModels}
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
