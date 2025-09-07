import * as React from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
    > * + * {
        margin-top: 16px;
    }
`;

const StyledFormBody = styled.div`
    padding: 0 16px;
`;

const StyledFormActions = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const Form: React.FC<{
    onSubmit(ev: React.SyntheticEvent<HTMLFormElement>): void
    renderBody(): React.ReactNode
    renderActions(): React.ReactNode
}> = props => (
    <StyledForm onSubmit={props.onSubmit}>
        <StyledFormBody>
            {props.renderBody()}
        </StyledFormBody>
        <StyledFormActions>
            {props.renderActions()}
        </StyledFormActions>
    </StyledForm>
);