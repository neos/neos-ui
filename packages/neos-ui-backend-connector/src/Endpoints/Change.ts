
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

export function isSimilarTo(first: Change, second: Change): boolean {
    if (first.type !== second.type) {
        return false;
    }
    if (first.subject !== second.subject) {
        return false;
    }
    if (first.type === 'Neos.Neos.Ui:Property') {
        return first.payload.propertyName === second.payload.propertyName;
    }
    if (first.type === 'Neos.Neos.Ui:Reference') {
        return first.payload.referenceName === second.payload.referenceName;
    }
    return false;
}
