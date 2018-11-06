import React from 'react';
import {storiesOf, action} from '@storybook/react';
import {StoryWrapper} from './../_lib/storyUtils';
import Tree from '.';

storiesOf('Tree', module)
    .addWithInfo(
        'default',
        () => (
            <StoryWrapper>
                <Tree>
                    <Tree.Node>
                        <Tree.Node.Header
                            hasChildren={true}
                            isCollapsed={false}
                            isActive={true}
                            isFocused={true}
                            isLoading={false}
                            isDirty={true}
                            hasError={false}
                            label="Active focused node with children"
                            onNodeToggle={action('onNodeToggle')}
                            onNodeClick={action('onNodeClick')}
                            onNodeFocus={action('onNodeFocus')}
                            />
                        <Tree.Node.Contents>
                            <Tree.Node>
                                <Tree.Node.Header
                                    hasChildren={false}
                                    isCollapsed={true}
                                    isActive={false}
                                    isFocused={false}
                                    isLoading={false}
                                    hasError={false}
                                    label="Normal node"
                                    onNodeToggle={action('onNodeToggle')}
                                    onNodeClick={action('onNodeClick')}
                                    onNodeFocus={action('onNodeFocus')}
                                    />
                            </Tree.Node>
                            <Tree.Node>
                                <Tree.Node.Header
                                    hasChildren={false}
                                    isCollapsed={true}
                                    isActive={true}
                                    isFocused={false}
                                    isLoading={false}
                                    isDirty={true}
                                    hasError={false}
                                    label="Active node"
                                    onNodeToggle={action('onNodeToggle')}
                                    onNodeClick={action('onNodeClick')}
                                    onNodeFocus={action('onNodeFocus')}
                                    />
                            </Tree.Node>
                            <Tree.Node>
                                <Tree.Node.Header
                                    hasChildren={false}
                                    isCollapsed={true}
                                    isActive={false}
                                    isFocused={true}
                                    isLoading={false}
                                    hasError={false}
                                    label="Focused node"
                                    onNodeToggle={action('onNodeToggle')}
                                    onNodeClick={action('onNodeClick')}
                                    onNodeFocus={action('onNodeFocus')}
                                    />
                            </Tree.Node>
                            <Tree.Node>
                                <Tree.Node.Header
                                    hasChildren={false}
                                    isCollapsed={true}
                                    isActive={false}
                                    isFocused={false}
                                    isLoading={false}
                                    isHiddenInIndex={true}
                                    hasError={false}
                                    label="Hidden in menus"
                                    onNodeToggle={action('onNodeToggle')}
                                    onNodeClick={action('onNodeClick')}
                                    onNodeFocus={action('onNodeFocus')}
                                    />
                            </Tree.Node>
                            <Tree.Node>
                                <Tree.Node.Header
                                    hasChildren={false}
                                    isCollapsed={true}
                                    isActive={false}
                                    isFocused={false}
                                    isLoading={false}
                                    isHidden={true}
                                    hasError={false}
                                    label="Hidden (invisible)"
                                    onNodeToggle={action('onNodeToggle')}
                                    onNodeClick={action('onNodeClick')}
                                    onNodeFocus={action('onNodeFocus')}
                                    />
                            </Tree.Node>
                        </Tree.Node.Contents>
                    </Tree.Node>
                </Tree>
            </StoryWrapper>
        ),
        {inline: true}
    )
    .addWithInfo(
        'drag and drop',
        () => (
            <StoryWrapper>
                <Tree>
                    <Tree.Node>
                        <Tree.Node.Header
                            hasChildren={true}
                            isCollapsed={false}
                            isActive={true}
                            isFocused={true}
                            isLoading={false}
                            hasError={false}
                            label="Parent Node"
                            onNodeToggle={action('onNodeToggle')}
                            onNodeClick={action('onNodeClick')}
                            onNodeFocus={action('onNodeFocus')}
                            />
                        <Tree.Node.Contents>
                            <Tree.Node>
                                <Tree.Node.Header
                                    hasChildren={false}
                                    isCollapsed={true}
                                    isActive={false}
                                    isFocused={false}
                                    isLoading={false}
                                    hasError={false}
                                    dragAndDropContext={{
                                        data: 'hello',
                                        acceptsBefore: () => true,
                                        acceptsInto: () => false,
                                        onDropBefore: action('dropBefore'),
                                        onDropInto: action('dropInto')
                                    }}
                                    label="Normal node"
                                    onNodeToggle={action('onNodeToggle')}
                                    onNodeClick={action('onNodeClick')}
                                    onNodeFocus={action('onNodeFocus')}
                                    />
                            </Tree.Node>
                            <Tree.Node>
                                <Tree.Node.Header
                                    hasChildren={false}
                                    isCollapsed={true}
                                    isActive={false}
                                    isFocused={false}
                                    isLoading={false}
                                    hasError={false}
                                    dragAndDropContext={{
                                        data: 'hello',
                                        acceptsBefore: () => false,
                                        acceptsInto: () => true,
                                        onDropBefore: action('dropBefore'),
                                        onDropInto: action('dropInto')
                                    }}
                                    label="Normal node"
                                    onNodeToggle={action('onNodeToggle')}
                                    onNodeClick={action('onNodeClick')}
                                    onNodeFocus={action('onNodeFocus')}
                                    />
                            </Tree.Node>
                        </Tree.Node.Contents>
                    </Tree.Node>
                </Tree>
            </StoryWrapper>
        ),
        {inline: true}
    );
