import React, {PureComponent, ReactNode} from 'react';
import mergeClassNames from 'classnames';

interface ShallowDropDownContentsTheme {
    readonly 'dropDown__contents': string;
    readonly 'dropDown__contents--isOpen': string;
    readonly 'dropDown__contents--scrollable': string;
}

export interface ShallowDropDownContentsProps {
    /**
     * An optional `className` to attach to the wrapper.
     */
    readonly className?: string;

    /**
     * The contents to be rendered within the contents wrapper.
     */
    readonly children: ReactNode;

    /**
     * Limit height and add scrollbar.
     */
    readonly scrollable?: boolean;

    /**
     * Limit height.
     */
    readonly limitHeight?: number;

    /**
     * These props control the visual state of the contents, and are passed
     * from the outside via the `ContextDropDownContents` component.
     */
    readonly isOpen: boolean;

    readonly closeDropDown: () => void;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: ShallowDropDownContentsTheme;
}

export default class ShallowDropDownContents extends PureComponent<ShallowDropDownContentsProps> {
    public render(): JSX.Element {
        const {
            className,
            children,
            theme,
            isOpen,
            closeDropDown,
            scrollable,
            limitHeight
        } = this.props;
        const finalClassName = mergeClassNames(
            theme!.dropDown__contents,
            className,
            {
                [theme!['dropDown__contents--scrollable']]: scrollable,
                [theme!['dropDown__contents--isOpen']]: isOpen
            }
        );
        const inlineHeightLimit = limitHeight && limitHeight > 0 ? {style: {'maxHeight': limitHeight + 'px'}} : {};

        return (
            <ul
                className={finalClassName}
                aria-hidden={isOpen ? 'false' : 'true'}
                aria-label="dropdown"
                role="listbox"
                onClick={closeDropDown}
                {...inlineHeightLimit}
            >
                {isOpen && children}
            </ul>
        );
    }
}
