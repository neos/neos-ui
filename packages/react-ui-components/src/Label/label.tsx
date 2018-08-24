import React from 'react';
import mergeClassNames from 'classnames';

export interface LabelProps {
    /**
     * The `for` standard html attribute, defined to make it always required.
     */
    htmlFor: string;
    /**
     * An optional className to render on the label node.
     */
    className: string | null | undefined;
    /**
     * The children to render within the label node.
     */
    children?: React.ReactNode;
    /**
     * An optional css theme to be injected.
     */
    theme?: {
        label: string
    };
    [x: string]: any;
}

const Label: React.SFC<LabelProps> = ({
        children,
        className,
        htmlFor,
        theme,
        ...rest
    }) => {
    const classNames = mergeClassNames({
        [theme && theme.label || '']: true,
        [className || '']: className && className.length
    });
    return (
        <label {...rest} htmlFor={htmlFor} className={classNames}>
            {children}
        </label>
    );
};

export default Label;
