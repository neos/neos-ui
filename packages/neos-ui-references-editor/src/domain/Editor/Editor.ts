import {IReference, IReferences} from "../References";
import {Change} from "@neos-project/neos-ui-backend-connector/src/Endpoints/Change";
import {IReferenceWithProperties} from "../References/References";

export class Editor {
    private constructor(
        private readonly data: {
            readonly isLocked: boolean;
            readonly isReferencePropertyEditingOpen: boolean;
            readonly initialReferencesCount: number;
            readonly initialValues: IReferences;
            readonly transientValues: IReferences;
            readonly transientReferencePropertyValues: IReferenceWithProperties;
            readonly constraints: any;
            readonly propertySchema: any;
        }
    ) {
    }

    public static fromLoadingState(initialReferencesCount: number): Editor {
        return new Editor({
            initialReferencesCount,
        })
    }

    public withReferencesAndConfiguration(initialValues: IReferences, constraints: any, propertySchema: any): Editor {
        return new Editor({
            ...this.data,
            initialValues,
            constraints,
            propertySchema,
        })
    }

    public withReferencePropertyEditing(): Editor {
        return new Editor({
            ...this.data,
            isReferencePropertyEditingOpen: true,
            transientReferencePropertyValues: Object.fromEntries(Object.entries(this.data.transientValues ?? this.data.initialValues).map(([targetNodeId, reference]) => [
                targetNodeId,
                {
                    targetNodeId,
                    properties: reference.properties
                }
            ]))
        })
    }

    public withRemovedReference(referenceTargetId: string): Editor {
        const {[referenceTargetId]: _, ...otherReferences} = this.data.transientValues ?? this.data.initialValues;

        return new Editor({
            ...this.data,
            transientValues: otherReferences
        })
    }

    public withDismissedReferencePropertyEditing(): Editor {
        return new Editor({
            ...this.data,
            isReferencePropertyEditingOpen: false,
            transientReferencePropertyValues: {}
        })
    }

    public withAppliedReferencePropertyEditing(): Editor {
        return new Editor({
            ...this.data,
            isReferencePropertyEditingOpen: false,
            transientValues: Object.entries(this.data.transientValues ?? this.data.initialValues).reduce((carry, [targetNodeId, reference]) => {
                return {
                    ...carry,
                    [targetNodeId]: {
                        ...reference,
                        properties: this.data.transientReferencePropertyValues[targetNodeId]
                    }
                }
            }, {}),
        })
    }

    public withDiscard(): Editor {
        return new Editor({
            initialValues: this.data.initialValues
        })
    }

    public isReferencePropertyEditingOpen(): boolean
    {
        return this.data.isReferencePropertyEditingOpen;
    }

    public isLoading(): boolean
    {
        return !Boolean(this.data.initialValues)
    }

    public getLoadingReferencesCount(): number
    {
        return this.data.initialReferencesCount;
    }

    public getReferences(): IReferences
    {
        return this.data.transientValues ?? this.data.initialValues;
    }

    public getChange(nodeAddress: string, referenceName: string): Change | null
    {
        if (this.data.isReferencePropertyEditingOpen) {
            return null;
        }
        if (!this.data.transientValues) {
            return null;
        }
        return {
            type: 'Neos.Neos.Ui:Reference',
            subject: nodeAddress,
            payload: {
                referenceName,
                serializedReferences: Object.keys(this.data.transientValues),
            }
        };
    }
}
