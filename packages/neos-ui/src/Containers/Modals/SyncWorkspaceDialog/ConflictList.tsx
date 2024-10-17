/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from 'react';

import {I18nRegistry} from '@neos-project/neos-ts-interfaces';
import I18n from '@neos-project/neos-ui-i18n';
import {Icon} from '@neos-project/react-ui-components';
import {Conflict, ReasonForConflict} from '@neos-project/neos-ui-redux-store/src/CR/Syncing';
import {TypeOfChange} from '@neos-project/neos-ui-redux-store/src/CR/Workspaces';

import style from './style.module.css';

export const ConflictList: React.FC<{
    conflicts: Conflict[];
    i18n: I18nRegistry;
}> = (props) => {
    return (
        <ul className={style.conflictList}>
            {props.conflicts.map((conflict) => (
                <ConflictItem
                    key={conflict.key}
                    conflict={conflict}
                    i18n={props.i18n}
                    />
            ))}
        </ul>
    )
}

const VARIANTS_BY_TYPE_OF_CHANGE = {
    [TypeOfChange.NODE_HAS_BEEN_CHANGED]: {
        icon: 'pencil',
        label: {
            id: 'Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.typeOfChange.NODE_HAS_BEEN_CHANGED.label',
            fallback: (props: { label: string }) =>
                `"${props.label}" has been edited.`
        }
    },
    [TypeOfChange.NODE_HAS_BEEN_CREATED]: {
        icon: 'plus',
        label: {
            id: 'Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.typeOfChange.NODE_HAS_BEEN_CREATED.label',
            fallback: (props: { label: string }) =>
                `"${props.label}" has been created.`
        }
    },
    [TypeOfChange.NODE_HAS_BEEN_DELETED]: {
        icon: 'times',
        label: {
            id: 'Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.typeOfChange.NODE_HAS_BEEN_DELETED.label',
            fallback: (props: { label: string }) =>
                `"${props.label}" has been deleted.`
        }
    },
    [TypeOfChange.NODE_HAS_BEEN_MOVED]: {
        icon: 'long-arrow-right',
        label: {
            id: 'Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.typeOfChange.NODE_HAS_BEEN_MOVED.label',
            fallback: (props: { label: string }) =>
                `"${props.label}" has been moved.`
        }
    }
} as const;

const VARIANTS_BY_REASON_FOR_CONFLICT = {
    [ReasonForConflict.NODE_HAS_BEEN_DELETED]: {
        icon: 'times',
        label: {
            id: 'Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.reasonForConflict.NODE_HAS_BEEN_DELETED.label',
            fallback: (props: { label: string }) =>
                `"${props.label}" or one of its ancestor nodes has been deleted.`
        }
    }
} as const;

const ConflictItem: React.FC<{
    conflict: Conflict;
    i18n: I18nRegistry;
}> = (props) => {
    const changeVariant = props.conflict.typeOfChange === null
        ? null
        : VARIANTS_BY_TYPE_OF_CHANGE[props.conflict.typeOfChange];
    const reasonVariant = props.conflict.reasonForConflict === null
        ? null
        : VARIANTS_BY_REASON_FOR_CONFLICT[props.conflict.reasonForConflict];
    const affectedNode = props.conflict.affectedNode ?? {
        icon: 'question',
        label: props.i18n.translate(
            'Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.unknownNode',
            'Unknown Node'
        )
    };
    const affectedDocument = props.conflict.affectedDocument ?? {
        icon: 'question',
        label: props.i18n.translate(
            'Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.unknownDocument',
            'Unknown Document'
        )
    };
    const affectedSite = props.conflict.affectedSite ?? {
        icon: 'question',
        label: props.i18n.translate(
            'Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.unknownSite',
            'Unknown Site'
        )
    };

    return (
        <li className={style.conflict}>
            <details className={style.conflict__details}>
                <summary className={style.conflict__summary}>
                    <div className={style.conflict__summary__contents}>
                        <Node
                            {...affectedNode}
                            typeOfChange={props.conflict.typeOfChange}
                            />
                    </div>
                </summary>

                <dl className={style.conflict__descriptionList}>
                    <div className={style.conflict__descriptionList__group}>
                        <dt className={style.conflict__descriptionList__title}>
                            <I18n
                                id="Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.affectedSite.label"
                                fallback="Affected Site"
                                />
                        </dt>
                        <dd className={style.conflict__descriptionList__description}>
                            <Node {...affectedSite} />
                        </dd>
                    </div>
                    <div className={style.conflict__descriptionList__group}>
                        <dt className={style.conflict__descriptionList__title}>
                            <I18n
                                id="Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.affectedDocument.label"
                                fallback="Affected Document"
                                />
                        </dt>
                        <dd className={style.conflict__descriptionList__description}>
                            <Node {...affectedDocument} />
                        </dd>
                    </div>
                    <div className={style.conflict__descriptionList__group}>
                        <dt className={style.conflict__descriptionList__title}>
                            <I18n
                                id="Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.typeOfChange.label"
                                fallback="What was changed?"
                                />
                        </dt>
                        {changeVariant ? (
                            <dd className={style.conflict__descriptionList__description}>
                                <Icon
                                    className={style.conflict__changeIcon}
                                    icon={changeVariant.icon}
                                    />
                                <I18n
                                    id={changeVariant.label.id}
                                    fallback={changeVariant.label.fallback({
                                        label: affectedNode.label
                                    })}
                                    params={{
                                        label: affectedNode.label
                                    }}
                                    />
                            </dd>
                        ) : (
                            <dd className={style.conflict__descriptionList__description}>
                                <I18n
                                    id="Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.typeOfChange.unknownMessage"
                                    fallback="Sorry, but there is no available information on this change."
                                    />
                            </dd>
                        )}

                    </div>
                    <div className={style.conflict__descriptionList__group}>
                        <dt className={style.conflict__descriptionList__title}>
                            <I18n
                                id="Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.reasonForConflict.label"
                                fallback="Why is there a conflict?"
                                />
                        </dt>
                        {reasonVariant ? (
                            <dd className={style.conflict__descriptionList__description}>
                                <Icon icon={reasonVariant.icon} />
                                <I18n
                                    id={reasonVariant.label.id}
                                    fallback={reasonVariant.label.fallback({
                                        label: affectedNode.label
                                    })}
                                    params={{
                                        label: affectedNode.label
                                    }}
                                    />
                            </dd>
                        ) : (
                            <dd className={style.conflict__descriptionList__description}>
                                <I18n
                                    id="Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.reasonForConflict.unknownMessage"
                                    fallback="Sorry, but there is no available information on the reason for this conflict."
                                    />
                            </dd>
                        )}
                    </div>
                </dl>
            </details>
        </li>
    );
}

const Node: React.FC<{
        icon: string;
        label: string;
        typeOfChange?: null | TypeOfChange;
}> = (props) => (
    <span className={style.node}>
        <Icon
            className={style.node__icon}
            icon={props.icon ?? 'question'}
            />
        {props.typeOfChange ? (
            <Icon
                className={style.node__changeIcon}
                icon={VARIANTS_BY_TYPE_OF_CHANGE[props.typeOfChange].icon}
                />
        ) : null}
        {props.label ?? (
            <I18n
                id="Neos.Neos.Ui:SyncWorkspaceDialog:conflictList.unknownNode"
                fallback="Unknown Node"
                />
        )}
    </span>
);
