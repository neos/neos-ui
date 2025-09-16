import * as React from 'react';
import styled from 'styled-components';

const StyledForm = styled.div`
    > * + * {
        margin-top: 16px;
    }
`;

const StyledFormBody = styled.div`
    padding: 0 16px;
`;

export const Form: React.FC<{
    renderBody(): React.ReactNode
}> = props => (
    <StyledForm>
        <StyledFormBody>
            {props.renderBody()}
        </StyledFormBody>
    </StyledForm>
);
