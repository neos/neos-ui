import styled from 'styled-components';

export const Container = styled.div`
    padding: 16px;
`;

export const Stack = styled.div`
    > * + * {
        margin-top: 16px;
    }
`;

export const Columns = styled.div`
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(max(160px, calc(50% - 8px)), calc(33.3333% - 8px)));
    min-width: 600px;
`;