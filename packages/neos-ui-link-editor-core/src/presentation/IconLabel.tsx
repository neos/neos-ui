import * as React from 'react';
import styled from 'styled-components';

import {Icon} from '@neos-project/react-ui-components';

const Container = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
`;

export const IconLabel: React.FC<{
    icon: string
}> = props => (
    <Container>
        <Icon icon={props.icon}/>
        {props.children}
    </Container>
);
