import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';

import ButtonGroupItem, {ButtonGroupItemId} from './buttonGroupItem';

interface ButtonGroupTheme {
    readonly buttonGroup: string;
}

export interface ButtonGroupProps {
    /**
     * An optional `className` to attach to the wrapper.
     */
    readonly className?: string;

    /**
     * Current value
     */
    readonly value: any;

    /**
     * Called when new value is selected. Returns an id of the activated button
     */
    readonly onSelect: (value: any) => ButtonGroupItemId;

    /**
     * The contents to be rendered within the `Bar`.
     */
    readonly children: ReadonlyArray<React.ReactElement<any>>;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: ButtonGroupTheme;
}

class ButtonGroup extends PureComponent<ButtonGroupProps> {
    public render(): JSX.Element {
        const {
            children,
            className,
            theme,
            value,
            onSelect,
            ...rest
        } = this.props;
        const finalClassName = mergeClassNames(
            theme!.buttonGroup,
            className,
        );

        return (
            <div {...rest} className={finalClassName}>
                {
                    children.map((child, index) => {
                        return (
                            <ButtonGroupItem
                                {...child.props}
                                key={index}
                                onClick={onSelect}
                                isPressed={value === child.props.id}
                                element={child}
                                />
                        );
                    })
                }
            </div>
        );
    }
}

export default ButtonGroup;
