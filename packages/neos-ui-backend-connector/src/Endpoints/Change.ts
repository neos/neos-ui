
export type Change = PropertyChange | ReferenceChange;

export interface PropertyChange extends Readonly<{
    type: 'Neos.Neos.Ui:Property';
    subject: string;
    payload: {
        propertyName: string;
        value: any;
        nodeDomAddress?: {
            contextPath: string,
            fusionPath: string
        }
    };
}> {}

// todo deduplicate qued changed and add isEqual methods and isSubject
export interface ReferenceChange extends Readonly<{
    type: 'Neos.Neos.Ui:Reference';
    subject: string;
    payload: {
        referenceName: string;
        serializedReferences: any;
        nodeDomAddress?: {
            contextPath: string,
            fusionPath: string
        }
    };
}> {}
