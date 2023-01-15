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
import * as s from "@neos-project/framework-schema";
import { notifications } from "./createNotification";

let since = Math.round(Date.now() / 1000);
let busy = false;

const inboxResponseSchema = s.object({
    __type: s.literal("Neos\\Neos\\Ui\\Framework\\Api\\Inbox\\InboxDto"),
    latest: s.number(),
    notifications: s.array(
        s.object.lax({
            __type: s.string(),
        })
    ),
    statuses: s.array(
        s.object.lax({
            __type: s.string(),
        })
    ),
});

export const fetchInbox = async () => {
    if (document.visibilityState !== "visible") return;
    if (busy) return;
    busy = true;

    const urlSearchParams = new URLSearchParams({
        since: since.toString(10),
    });
    const url = new URL(window.location.href.split("?")[0]);

    url.pathname = "/neos/ui-api/inbox";
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

    try {
        const responseAsRawJson = await response.json();
        const inboxResponse = inboxResponseSchema.ensure(responseAsRawJson);

        since = inboxResponse.latest;

        for (const notification of inboxResponse.notifications) {
            const { publish } = notifications.get(notification.__type)!;

            publish(notification);
        }
    } catch (error) {
        console.error("Error during event polling: ", { error });
    } finally {
        busy = false;
    }
};

export const startPolling = (interval: number) => {
    setInterval(fetchInbox, interval);
};
