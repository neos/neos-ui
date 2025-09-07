import * as React from 'react';
import styled from 'styled-components';

import {CardTitle} from './CardTitle';

const Container = styled.div`
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 75px 1fr;
    background-color: #141414;
    padding: 0 16px 0 0;
`;

const Image = styled.img`
    display: block;
    grid-column: 1 / span 1;
    width: 100%;
    height: 56px;
    object-fit: contain;
    background-color: #fff;
    background-size: 10px 10px;
    background-position: 0 0, 25px 25px;
    background-image: linear-gradient(45deg, #cccccc 25%, transparent 25%, transparent 75%, #cccccc 75%, #cccccc), linear-gradient(45deg, #cccccc 25%, transparent 25%, transparent 75%, #cccccc 75%, #cccccc);
`;

interface Props {
    label: string
    src: string
}

export const ImageCard: React.FC<Props> = props => {
    return (
        <Container>
            <Image src={props.src}/>
            <CardTitle span={1}>
                {props.label}
            </CardTitle>
        </Container>
    );
}