import mergeClassNames from 'classnames';
import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    /**
     * The `for` standard html attribute, defined to make it always required.
     */
    readonly htmlFor: string;
    /**
     * An optional className to render on the label node.
     */
    readonly className?: string;
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
}

const Label: React.SFC<LabelProps> = ({
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
