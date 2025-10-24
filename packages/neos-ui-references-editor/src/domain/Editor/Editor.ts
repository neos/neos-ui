import {IReferences} from "../References";
import {Change} from "@neos-project/neos-ui-backend-connector/src/Endpoints/Change";

export class Editor {
    private constructor(
        private readonly data: {
            readonly isLocked: boolean;
            readonly isDirty: boolean;
            readonly isReferencePropertyEditingOpen: boolean;
            readonly initialReferencesCount: number;
            readonly initialValues: IReferences;
            readonly transientValues: IReferences;
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
            isDirty: false,
            initialValues,
            constraints,
            propertySchema,
        })
    }

    public withReferencePropertyEditing(): Editor {
        return new Editor({
            ...this.data,
            isReferencePropertyEditingOpen: true,
        })
    }

    public withDismissedReferencePropertyEditing(): Editor {
        return new Editor({
            ...this.data,
            isReferencePropertyEditingOpen: false,
            transientValues: {}
        })
    }

    public withAppliedReferencePropertyEditing(): Editor {
        return new Editor({
            ...this.data,
            isDirty: true,
            isReferencePropertyEditingOpen: false,
            initialValues: {...this.data.initialValues, ...this.data.transientValues},
            transientValues: {}
        })
    }

    public isReferencePropertyEditingOpen(): boolean
    {
        return this.data.isReferencePropertyEditingOpen;
    }

    public getChange(nodeAddress: string): Change | null
    {
        if (this.data.isReferencePropertyEditingOpen) {
            return null;
        }
        if (!this.data.isDirty) {
            return null;
        }
        return {
            type: 'Neos.Neos.Ui:Property',
            subject: nodeAddress,
            payload: {
                propertyName: 'lol',
                value: 'test' + Math.random(),
            }
        };
    }
}
