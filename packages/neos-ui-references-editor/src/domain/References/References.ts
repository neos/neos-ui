export interface IReference {
    targetNodeId: string,
    properties: any,
}

export interface IReferences {
    [targetNodeId: string]: IReference
}
