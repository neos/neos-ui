
// FIXME, these aliases are not good practice.
// Its still allowed to pass strings around and no type safety is gained and the IDE will not show the name of the type when checking a field but just the resolved primitive.
// Instead we should use ValueObjects (ES6 Classes) or decide for a typescript "hack" to attach a unique Symbol to the type like: string & { readonly __id: unique symbol };
export type DimensionName = string;
export type DimensionValue = string;
export type DimensionPresetName = string;

export type DimensionValues = DimensionValue[];

export interface DimensionCombination {
    [propName: string]: DimensionValues;
}

export interface DimensionPresetCombination {
    [propName: string]: DimensionPresetName;
}

export interface PresetConfiguration {
    name?: string;
    label: string;
    values: DimensionValues;
    uriSegment: string;
}

export interface DimensionInformation {
    default: string;
    defaultPreset: string;
    label: string;
    icon: string;
    presets: {
        [propName: string]: PresetConfiguration;
    };
}
