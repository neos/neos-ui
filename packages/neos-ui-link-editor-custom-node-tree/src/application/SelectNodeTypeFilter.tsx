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
import { useAsync } from "react-use";
import { VError } from "@neos-project/neos-ui-link-editor-error-handling";

import { SelectBox } from "@neos-project/react-ui-components";
import { useI18n } from "@neos-project/neos-ui-link-editor-neos-bridge";

import { getNodeTypeFilterOptions } from "../infrastructure/http";

const searchNodeTypeFilterOptions = (
    searchTerm: string,
    options: {
        value: string;
        label: any;
        icon?: string;
    }[]
) =>
    options.filter(
        (option) =>
            option.label.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    );

interface Props {
    baseNodeTypeFilter: string;
    value: string;
    onChange: (value: string) => void;
}

export const SelectNodeTypeFilter: React.FC<Props> = (props) => {
    const i18n = useI18n();
    const [filterTerm, setFilterTerm] = React.useState("");
    const fetch__options = useAsync(async () => {
        const result = await getNodeTypeFilterOptions({
            baseNodeTypeFilter: props.baseNodeTypeFilter,
        });

        if ("success" in result) {
            return result.success.options.map((option) => ({
                value: option.value,
                icon: option.label.icon,
                label: i18n(option.label.label)
            }));
        }

        if ("error" in result) {
            throw new VError(result.error.message);
        }

        throw new VError("Unable to fetch node type filter options");
    }, [props.baseNodeTypeFilter]);
    const options = React.useMemo(() => {
        return searchNodeTypeFilterOptions(
            filterTerm,
            fetch__options.value ?? []
        );
    }, [filterTerm, fetch__options.value]);

    return (
        <SelectBox
            disabled={fetch__options.loading || fetch__options.error}
            placeholder={i18n("Neos.Neos:Main:filter")}
            placeholderIcon={"filter"}
            onValueChange={props.onChange}
            allowEmpty={true}
            value={props.value}
            options={options}
            displaySearchBox={true}
            searchTerm={filterTerm}
            onSearchTermChange={setFilterTerm}
            threshold={0}
            noMatchesFoundLabel={i18n("Neos.Neos:Main:noMatchesFound")}
            searchBoxLeftToTypeLabel={i18n(
                "Neos.Neos:Main:searchBoxLeftToType"
            )}
        />
    );
};
