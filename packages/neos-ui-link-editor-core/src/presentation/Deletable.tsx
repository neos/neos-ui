import * as React from 'react';
import styled from 'styled-components';

import {IconButton} from '@neos-project/react-ui-components';

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 40px;
    justify-content: stretch;
    border: 1px solid #3f3f3f;
    max-width: 420px;
`;

const StyledIconButton = styled(IconButton)`
    height: 100%;
`;

export const Deletable: React.FC<{
    onDelete(): void
}> = props => (
    <Container>
        <div>{props.children}</div>
        <StyledIconButton icon="trash" hoverStyle="error" onClick={props.onDelete}/>
    </Container>
)