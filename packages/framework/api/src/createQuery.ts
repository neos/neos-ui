/**
 * @neos-project/framework-api - Neos CMS backend API facade
 *   Copyright (C) 2023 Contributors of Neos CMS
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { fetchWithErrorHandling } from "@neos-project/neos-ui-backend-connector";
import type { Infer, Validator } from "@neos-project/framework-schema";

import { jsonToParams } from "./jsonToParams";

type QueryType<Q extends Validator<{ __type: string }>> = Infer<Q>;
type QueryInputType<Q extends Validator<{ __type: string }>> = Omit<
    QueryType<Q>,
    "__type"
>;

export const createQuery = <
    Q extends Validator<{ __type: string }>,
    QR extends Validator<{ __type: string }>
>(
    queryTypeName: string,
    _querySchema: Q,
    queryResultSchema: QR
) => {
    return async (query: QueryInputType<Q>) => {
        const urlSearchParams = new URLSearchParams(
            jsonToParams({
                query: { __type: queryTypeName, ...query },
            })
        );
        const url = new URL(window.location.href.split("?")[0]);

        url.pathname = "/neos/ui-api/query";
        url.search = urlSearchParams.toString();

        const response: Response = await fetchWithErrorHandling.withCsrfToken(
            (csrfToken) => ({
                url: url.toString(),

                method: "GET",
                credentials: "include",
                headers: {
                    "X-Flow-Csrftoken": csrfToken,
                },
            })
        );

        const responseAsRawJson = await response.json();

        return queryResultSchema.ensure(responseAsRawJson) as Infer<QR>;
    };
};
