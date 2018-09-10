import mergeClassNames from 'classnames';
import React from 'react';

export interface ILabelProps {
    /**
     * The `for` standard html attribute, defined to make it always required.
     */
    readonly htmlFor: string;
    /**
     * An optional className to render on the label node.
     */
    readonly className: string | null | undefined;
    /**
     * The children to render within the label node.
     */
    readonly children?: React.ReactNode;
    /**
     * An optional css theme to be injected.
     */
    readonly theme?: {
        readonly label: string
    };
    readonly [x: string]: any; // TODO: Consider extending this interface with React.LabelHTMLAttributes<HTMLLabelElement>
}

const Label: React.SFC<ILabelProps> = ({
        children,
        className,
        htmlFor,
        theme,
        ...rest
    }) => {
    const classNames = mergeClassNames(theme!.label, className);

    return (
        <label {...rest} htmlFor={htmlFor} className={classNames}>
            {children}
        </label>
    );
};

export default Label;
