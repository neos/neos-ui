/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import * as React from 'react';
import debounce from 'lodash.debounce';

import {usePromise} from '@neos-project/framework-promise-react';
import {Icon, Tree as NeosTree} from '@neos-project/react-ui-components';
import {NestedError} from '@neos-project/neos-ui-error';

import {TreeNode} from './TreeNode';
import {Search} from './Search';
import {SelectNodeTypeFilter} from './SelectNodeTypeFilter';
import {getTree} from '../infrastructure/http';
import style from './style.module.css';

interface Props {
    initialSearchTerm?: string;
    initialNarrowNodeTypeFilter?: string;
    workspaceName: string;
    legacyDimensionValues: Record<string, string[]>;
    startingPoint: string;
    loadingDepth: number;
    baseNodeTypeFilter: string;
    linkableNodeTypes?: string[];
    selectedTreeNodeId?: string;
    options?: {
        enableSearch?: boolean;
        enableNodeTypeFilter?: boolean;
    };
    onSelect(nodeId: string): void;
}

export const Tree: React.FC<Props> = (props) => {
    const [searchTerm, setSearchTerm] = React.useState<string>(
        props.initialSearchTerm ?? ''
    );
    const [narrowNodeTypeFilter, setNarrowNodeTypeFilter] =
        React.useState<string>(props.initialNarrowNodeTypeFilter ?? '');
    const fetch__getTree = usePromise(async () => {
        const result = await getTree({
            workspaceName: props.workspaceName,
            legacyDimensionValues: props.legacyDimensionValues,
            startingPoint: props.startingPoint,
            loadingDepth: props.loadingDepth,
            baseNodeTypeFilter: props.baseNodeTypeFilter,
            linkableNodeTypes: props.linkableNodeTypes,
            selectedNodeId: props.selectedTreeNodeId,
            narrowNodeTypeFilter,
            searchTerm
        });

        if ('success' in result) {
            return result.success;
        }

        if ('error' in result) {
            throw result.error;
        }

        throw new Error('Something went wrong while fetching the tree.');
    }, [
        props.workspaceName,
        props.legacyDimensionValues,
        props.startingPoint,
        props.loadingDepth,
        props.baseNodeTypeFilter,
        props.linkableNodeTypes,
        narrowNodeTypeFilter,
        searchTerm
    ]);
    const handleTreeNodeClick = React.useCallback((treeNodeId: string) => {
        props.onSelect(treeNodeId);
    }, []);

    const handleSearchTermChange = React.useCallback(debounce((newSearchTerm: string) => {
        setSearchTerm(newSearchTerm);
    }, 300), []);

    const handleNodeTypeFilterChange = React.useCallback(
        (newNodeTypeFilter: string) => {
            setNarrowNodeTypeFilter(newNodeTypeFilter);
        },
        []
    );

    let main;
    if (fetch__getTree.error) {
        throw NestedError.create(
            'NodeTree could not be loaded.',
            fetch__getTree.error,
        );
    } else if (fetch__getTree.isLoading || !fetch__getTree.value) {
        main = <div className={style.spinnerContainer}><Icon icon="spinner" spin size="2x" /></div>
    } else {
        main = (
            <NeosTree>
                <TreeNode
                    workspaceName={props.workspaceName}
                    legacyDimensionValues={props.legacyDimensionValues}
                    baseNodeTypeFilter={props.baseNodeTypeFilter}
                    linkableNodeTypes={props.linkableNodeTypes}
                    treeNode={fetch__getTree.value.root}
                    selectedTreeNodeId={props.selectedTreeNodeId}
                    level={1}
                    onClick={handleTreeNodeClick}
                />
            </NeosTree>
        );
    }

    let search = null;
    if (props.options?.enableSearch) {
        search = (
            <Search
                initialValue={props.initialSearchTerm ?? ''}
                onChange={handleSearchTermChange}
            />
        );
    }

    let filter = null;
    if (props.options?.enableNodeTypeFilter) {
        filter = (
            <SelectNodeTypeFilter
                baseNodeTypeFilter={props.baseNodeTypeFilter}
                value={narrowNodeTypeFilter}
                onChange={handleNodeTypeFilterChange}
            />
        );
    }

    return (
        <div className={style.treeContainer}>
            {search ? (
                <div style={{gridColumn: filter ? '1 / span 1' : '1 / span 2'}}>
                    {search}
                </div>
            ) : null}
            {filter ? (
                <div style={{gridColumn: search ? '2 / span 1' : '1 / span 2'}}>
                    {filter}
                </div>
            ) : null}
            <div className={style.treeNodeArea}>
                {main}
            </div>
        </div>
    );
};
