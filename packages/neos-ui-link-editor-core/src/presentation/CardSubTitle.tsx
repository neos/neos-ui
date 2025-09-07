import * as React from 'react';
import styled from 'styled-components';

import {Ellipsis} from './Ellipsis';

const Container = styled.span`
    display: flex;
    align-items: center;
    line-height: 1;
    font-size: 12px;
    color: #999;
    grid-column: 1 / span 2;
    grid-row: 2 / span 1;
    min-width: 0;
`;

export const CardSubTitle: React.FC<{
}> = props => (
    <Container>
        <Ellipsis>{props.children}</Ellipsis>
    </Container>
);