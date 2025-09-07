import * as React from 'react';
import styled from 'styled-components';

import {Icon} from '@neos-project/react-ui-components';
import {CardTitle} from './CardTitle';
import {CardSubTitle} from './CardSubTitle';

const Container = styled.div`
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 20px 1fr;
    grid-template-rows: repeat(2, 1fr);
    background-color: #141414;
    padding: 8px 16px;
    min-height: 50px;
`;

const IconWrapper = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    grid-column: 1 / span 1;
    grid-row: 1 / span ${(props: {span: number}) => props.span};
`;

interface Props {
    icon: string;
    title: string;
    subTitle?: string;
}

export const IconCard: React.FC<Props> = props => {
    return (
        <Container>
            <IconWrapper span={props.subTitle ? 1 : 2}>
                <Icon icon={props.icon}/>
            </IconWrapper>
            <CardTitle span={props.subTitle ? 1 : 2}>
                {props.title}
            </CardTitle>
            <CardSubTitle>
                {props.subTitle}
            </CardSubTitle>
        </Container>
    );
}