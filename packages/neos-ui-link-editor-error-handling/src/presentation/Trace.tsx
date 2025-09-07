import * as React from 'react';
import styled from 'styled-components';

const Container = styled.details`
`

const Title = styled.summary`
    cursor: pointer;
`

const Content = styled.pre`
    height: 60vh;
    max-height: 600px;
    padding: 8px;
    margin: 0;
    overflow: scroll;
    background-color: #111;
    box-shadow: inset 5px 5px 5px #000;
`;

export const Trace: React.FC<{
    title: string
}> = props => (
    <Container>
        <Title>{props.title}</Title>
        <Content>{props.children}</Content>
    </Container>
);