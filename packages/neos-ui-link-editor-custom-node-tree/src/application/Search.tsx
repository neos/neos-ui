/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import * as React from "react";
import { useDebounce } from "react-use";

import { SearchInput } from "../presentation";

interface Props {
    initialValue: string;
    onChange: (value: string) => void;
}

export const Search: React.FC<Props> = (props) => {
    const [value, setValue] = React.useState(props.initialValue);
    const handleClear = React.useCallback(() => {
        setValue("");
    }, [setValue]);

    useDebounce(
        () => {
            props.onChange(value);
        },
        300,
        [value]
    );

    return (
        <SearchInput value={value} onChange={setValue} onClear={handleClear} />
    );
};
