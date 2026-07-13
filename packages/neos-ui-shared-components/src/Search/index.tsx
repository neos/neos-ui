import * as React from 'react';
import {SearchInput} from '../SearchInput';

interface Props {
    id?: string;
    initialValue: string;
    onChange: (value: string) => void;
}

export const Search: React.FC<Props> = (props) => {
    const [value, setValue] = React.useState(props.initialValue);
    const handleClear = React.useCallback(() => {
        setValue('');
    }, [setValue]);

    React.useEffect(
        () => props.onChange(value),
        [value]
    );

    return (
        <SearchInput id={props.id} value={value} onChange={setValue} onClear={handleClear} />
    );
};
