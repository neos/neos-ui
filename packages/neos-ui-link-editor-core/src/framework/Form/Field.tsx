import * as React from 'react';
import {Field as FinalFormField, FieldProps, FieldRenderProps} from 'react-final-form';

const FieldGroupContext = React.createContext<null | string>(null);

export function Field<
    FieldValue = any,
    T extends HTMLElement = HTMLElement
>(props: FieldProps<FieldValue, FieldRenderProps<FieldValue, T>, T>): React.ReactElement {
    const groupPrefix = React.useContext(FieldGroupContext);
    const name = groupPrefix !== null
        ? `${groupPrefix}.${props.name}`
        : props.name;

    return (<FinalFormField<FieldValue, T> {...props} name={name}/>);
};

export const FieldGroup: React.FC<{
    prefix: string
}> = props => {
    return (
        <FieldGroupContext.Provider value={props.prefix}>
            {props.children}
        </FieldGroupContext.Provider>
    );
};
