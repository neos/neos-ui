import {DimensionCombination} from '@neos-project/neos-ts-interfaces';

export type ContentDimensionValue = string;

export interface DimensionSpacePoint {
    [contentDimensionId: string]: ContentDimensionValue;
}

export function createDimensionSpacePointFromLegacyDimension(legacyDimensionValues: DimensionCombination): DimensionSpacePoint {
    return Object.fromEntries(Object.entries(legacyDimensionValues).map(([name, values]) => [name, values[0]]));
}
