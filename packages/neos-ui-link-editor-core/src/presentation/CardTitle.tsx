import * as React from 'react';
import styled from 'styled-components';

import {Ellipsis} from './Ellipsis';

const Container = styled.span`
    display: flex;
    align-items: center;
    line-height: 1;
    grid-column: 2 / span 1;
    grid-row: 1 / span ${(props: { span: number; }) => props.span};
    font-size: 14px;
    color: #FFF;
    min-width: 0;
`;

export const CardTitle: React.FC<{
    span: number
}> = props => (
    <Container span={props.span}>
        <Ellipsis>{props.children}</Ellipsis>
    </Container>
);