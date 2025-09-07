import * as React from 'react';
import styled from 'styled-components';

import {Icon} from '@neos-project/react-ui-components';

const Container = styled.div`
    padding: 8px;
    background-color: #ff6a3c;
    color: #fff;

    > * + * {
        margin-top: 8px;
    }
`;

const Header = styled.header`
    display: flex;
    gap: 8px;
    align-items: center;
`;

export const Alert: React.FC<{
    title: string
}> = props => (
    <Container role="alert">
        <Header>
            <Icon icon="exclamation-triangle"/>
            {props.title}
        </Header>
        {props.children}
    </Container>
);