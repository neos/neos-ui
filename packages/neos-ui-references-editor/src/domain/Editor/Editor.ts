import {IReferences} from '../References';
import {Change} from '@neos-project/neos-ui-backend-connector/src/Endpoints/Change';
import {IReferenceWithProperties} from '../References/References';

export class Editor {
    private constructor(
        private readonly data: {
            readonly isLocked: boolean;
            readonly isReferencePropertyEditingOpen: boolean;
            readonly selectedReferenceId: string;
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
        return new Editor({initialReferencesCount})
    }

    public withReferencesAndConfiguration(initialValues: IReferences, constraints: any, propertySchema: any): Editor {
        return new Editor({
            ...this.data,
            initialValues,
            constraints,
            propertySchema
        })
    }

    public withReferencePropertyEditing(referenceTargetId: string): Editor {
        return new Editor({
            ...this.data,
            isReferencePropertyEditingOpen: true,
            selectedReferenceId: referenceTargetId,
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

    public withAddedReference(referenceTargetId: string, referenceValue: any): Editor {
        const transientValues = this.data.transientValues ?? this.data.initialValues;
        return new Editor({
            ...this.data,
            transientValues: {
                ...transientValues,
                [referenceTargetId]: referenceValue
            }
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
                        properties: this.data.transientReferencePropertyValues[targetNodeId].properties
                    }
                }
            }, {}),
            transientReferencePropertyValues: {}
        })
    }

    public withReferenceProperty(propertyName: string, value: any): Editor {
        return new Editor({
            ...this.data,
            transientReferencePropertyValues: {
                ...this.data.transientReferencePropertyValues,
                [this.data.selectedReferenceId]: {
                    ...this.data.transientReferencePropertyValues[this.data.selectedReferenceId],
                    properties: {
                        ...this.data.transientReferencePropertyValues[this.data.selectedReferenceId]?.properties,
                        [propertyName]: value
                    }
                }
            }
        })
    }

    public withDiscard(): Editor {
        return new Editor({
            initialValues: this.data.initialValues,
            constraints: this.data.constraints,
            propertySchema: this.data.propertySchema
        })
    }

    public isReferencePropertyEditingOpen(): boolean {
        return this.data.isReferencePropertyEditingOpen;
    }

    public isLoading(): boolean {
        return !this.data.initialValues
    }

    public getLoadingReferencesCount(): number {
        return this.data.initialReferencesCount;
    }

    public getReferences(): IReferences {
        return this.data.transientValues ?? this.data.initialValues;
    }

    public getPropertySchema(): any {
        return this.data.propertySchema ?? {};
    }

    public getReferencePropertyValue(propertyName: string): any {
        return this.data.transientReferencePropertyValues[this.data.selectedReferenceId]?.properties?.[propertyName]
    }

    public getChange(nodeAddress: string, referenceName: string): Change | null {
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
                serializedReferences: Object.keys(this.data.transientValues)
            }
        };
    }
}
