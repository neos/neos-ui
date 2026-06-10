export interface IReference {
    targetNodeId: string,
    properties: any,
    presentation?: {
        breadcrumbs: {
            icon: string;
            label: string;
        }[]
        icon: string;
        label: string;
        uri: string;
    }
}

export interface IReferences {
    [targetNodeId: string]: IReference
}

export interface IReferenceWithProperties {
    [targetNodeId: string]: {
        targetNodeId: string,
        properties: any,
    }
}
