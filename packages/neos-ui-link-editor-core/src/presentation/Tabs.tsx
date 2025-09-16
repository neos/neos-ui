import * as React from 'react';
import styled, {css} from 'styled-components';

const TabHeaderList = styled.ul`
    display: flex;
    margin: 0 0 -1px 0;
    padding: 0;
    list-style-type: none;

    > * + *  {
        margin-left: -1px;
    }
`;

const TabHeader = styled.button`
    height: 40px;
    ${(props: {isActive: boolean}) =>
        props.isActive
            ? css`border-top: 2px solid #00adee;`
            : css`border-top: 1px solid #3f3f3f;`
    }
    ${(props: {isActive: boolean}) =>
        props.isActive
            ? css`border-bottom: 1px solid #222;`
            : css`border-bottom: 1px solid #3f3f3f;`
    }
    border-right: 1px solid #3f3f3f;
    border-left: 1px solid #3f3f3f;
    color: #FFF;
    background-color: #222;
    line-height: 40px;
    padding: 0 16px;
    cursor: pointer;
`;

const TabPanel = styled.div`
    padding: 16px;
    background-color: #222;
    border: 1px solid #3f3f3f;
`;

interface Props<V> {
    from: ReadonlyArray<V>
    lazy?: boolean
    activeItemKey: string
    getKey(item: V): string
    renderHeader(item: V): React.ReactNode
    renderPanel(item: V): React.ReactNode
    onSwitchTab?(nextActiveItemKey: string): void
}

export function Tabs<V>(props: Props<V>) {
    if (props.from.length < 1) {
        throw new Error('[Neos.Neos.Ui:LinkEditor]: Tabs must have at least one item!');
    }

    const header = (
        <header>
            <nav>
                <TabHeaderList>
                    {props.from.map(item => (
                        <li key={props.getKey(item)}>
                            <TabHeader
                                type="button"
                                isActive={props.getKey(item) === props.activeItemKey}
                                onClick={() => {
                                    if (props.onSwitchTab) {
                                        props.onSwitchTab(props.getKey(item));
                                    }
                                }}
                            >
                                {props.renderHeader(item)}
                            </TabHeader>
                        </li>
                    ))}
                </TabHeaderList>
            </nav>
        </header>
    );
    const body = props.lazy
        ? (
            <div>
                {props.from.filter(item => props.getKey(item) === props.activeItemKey).map(item => (
                    <TabPanel key={props.getKey(item)}>
                        {props.renderPanel(item)}
                    </TabPanel>
                ))}
            </div>
        )
        : (
            <div>
                {props.from.map(item => (
                    <TabPanel
                        key={props.getKey(item)}
                        hidden={props.getKey(item) !== props.activeItemKey}
                    >
                        {props.renderPanel(item)}
                    </TabPanel>
                ))}
            </div>
        )
    ;

    return (
        <div>
            {header}
            {body}
        </div>
    );
}
