
export type Change = PropertyChange;

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
