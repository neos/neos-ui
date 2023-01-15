/**
 * @neos-project/neos-ui - Neos CMS UI written in ReactJS and a ton of other fun technology.
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

import { createPropertyDto, PropertyDto } from "@neos-project/neos-ui-api";

export class Buffer {
    private constructor(
        private readonly data: {
            readonly initialValues: { [key: string]: unknown };
            readonly transientValues: { [key: string]: unknown };
            readonly hooks: { [key: string]: unknown };
            readonly isLocked: boolean;
        }
    ) {}

    public static empty = (): Buffer =>
        new Buffer({
            initialValues: {},
            transientValues: {},
            hooks: {},
            isLocked: true,
        });

    public static fromPropertyDtos = (propertyDtos: PropertyDto[]): Buffer =>
        new Buffer({
            initialValues: Object.fromEntries(
                propertyDtos.map((propertyDto) => [
                    propertyDto.name,
                    propertyDto.value,
                ])
            ),
            transientValues: {},
            hooks: {},
            isLocked: false,
        });

    public readonly isEmpty = (): boolean => {
        const transientValuesAreEmpty =
            Object.keys(this.data.transientValues).length === 0;
        const hooksAreEmpty = Object.keys(this.data.hooks).length === 0;

        return transientValuesAreEmpty && hooksAreEmpty;
    };

    public readonly isLocked = (): boolean => {
        return this.data.isLocked;
    };

    public readonly get = (key: string): unknown => {
        if (key in this.data.transientValues) {
            return this.data.transientValues[key];
        }

        return this.data.initialValues[key] ?? null;
    };

    public readonly getHooks = (key: string): unknown => {
        return this.data.hooks[key] ?? null;
    };

    public readonly toPropertyDtos = (): PropertyDto[] =>
        Object.entries(this.data.transientValues).map(([name, value]) =>
            createPropertyDto({ name, value })
        );

    public readonly withValue = (key: string, value: unknown): Buffer => {
        if (this.data.transientValues[key] === value) {
            return this;
        }

        if (this.data.initialValues[key] === value) {
            const { [key]: _, ...remainingValues } = this.data.transientValues;

            return new Buffer({
                ...this.data,
                transientValues: remainingValues,
            });
        }

        return new Buffer({
            ...this.data,
            transientValues: { ...this.data.transientValues, [key]: value },
        });
    };

    public readonly withHooks = (key: string, hooks: unknown): Buffer => {
        if (this.data.hooks[key] === hooks) {
            return this;
        }

        return new Buffer({
            ...this.data,
            hooks: { ...this.data.hooks, [key]: hooks },
        });
    };

    public readonly lock = () => {
        if (this.data.isLocked) {
            return this;
        }

        return new Buffer({
            ...this.data,
            isLocked: true,
        });
    };

    public readonly discard = () => {
        if (this.isEmpty()) {
            return this;
        }

        return new Buffer({
            ...this.data,
            transientValues: {},
            hooks: {},
        });
    };

    public readonly apply = () => {
        if (this.isEmpty()) {
            return this;
        }

        return new Buffer({
            ...this.data,
            initialValues: {
                ...this.data.initialValues,
                ...this.data.transientValues,
            },
            transientValues: {},
            hooks: {},
        });
    };
}
