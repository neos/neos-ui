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

import { createChannel, Observable } from "@neos-project/framework-observable";
import { Infer, Validator } from "@neos-project/framework-schema";

export const notifications = new Map<string, { publish: (event: any) => void }>();

export const createNotification = <
    T extends string,
    N extends Validator<{ __type: T }>
>(
    notificationTypeName: T,
    notificationSchema: N
): Observable<Infer<N>> => {
    const { publish, ...observable } = createChannel<Infer<N>>();

    notifications.set(notificationTypeName, {
        publish: (event) => publish(notificationSchema.ensure(event) as any),
    });

    return Object.freeze({
        ...observable,
    });
};
