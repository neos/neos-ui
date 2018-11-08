import React, {PureComponent, ReactNode} from 'react';
import mergeClassNames from 'classnames';
import {PickDefaultProps} from '../../types';
import {makeFocusNode} from './../_lib/focusNode';

interface ShallowDropDownHeaderTheme {
    readonly 'dropDown__btn': string;
    readonly 'dropDown__btnLabel': string;
    readonly 'dropDown__chevron': string;
    readonly 'dropDown__btn--withChevron': string;
}

export interface ShallowDropDownHeaderProps {
    /**
         * An optional `className` to attach to the wrapper.
         */
        readonly className?: string;

        /**
         * Icon to use if the dropdown is opened
         */
        readonly iconIsOpen?: string;

        /**
         * Icon to use if the dropdown is opened
         */
        readonly iconIsClosed?: string;

        /**
         * These props control the visual state of the contents, and are passed
         * from the outside via the `ContextDropDownHeader` component.
         */
        readonly isOpen?: boolean;

        readonly showDropDownToggle?: boolean;

        /**
         * If TRUE, will keep the focussed state of the element when re-drawing.
         * Must be set to FALSE when connected components want to manage the focus state themselves (e.g.
         * when this component is used to build a select box)
         */
        readonly shouldKeepFocusState?: boolean;

        /**
         * Disable the onclick handler if disabled
         */
        readonly disabled?: boolean;

        /**
         * An interal prop for testing purposes, do not set this prop manually.
         */
        readonly _refHandler?: (isFocused: boolean) => (node: any) => void;

        readonly toggleDropDown?: () => void;

        /**
         * Static component dependencies which are injected from the outside (index.js)
         */
        readonly IconComponent?: any;

        /**
         * A object wich will be spreaded on the icon component
         */
        readonly iconRest?: object;

        /**
         * The contents to be rendered within the header.
         */
        readonly children?: ReactNode;

         /**
         * An optional css theme to be injected.
         */
        readonly theme?: ShallowDropDownHeaderTheme;
}

type DefaultProps = PickDefaultProps<ShallowDropDownHeaderProps,
    '_refHandler' |
    'showDropDownToggle' |
    'shouldKeepFocusState' |
    'iconIsOpen' |
    'iconIsClosed'
>;

export const defaultProps: DefaultProps = {
    _refHandler: makeFocusNode,
    showDropDownToggle: true,
    shouldKeepFocusState: true,
    iconIsOpen: 'chevron-up',
    iconIsClosed: 'chevron-down'
};

class ShallowDropDownHeader extends PureComponent<ShallowDropDownHeaderProps> {
    public static readonly defaultProps = defaultProps;

    public render(): JSX.Element {
        const {
            className,
            children,
            theme,
            isOpen,
            showDropDownToggle,
            toggleDropDown,
            IconComponent,
            _refHandler,
            shouldKeepFocusState,
            iconIsOpen,
            iconIsClosed,
            iconRest,
            disabled,
            ...rest
        } = this.props;
        const iconName = isOpen ? iconIsOpen : iconIsClosed;
        const finalClassName = mergeClassNames(
            theme!.dropDown__btn,
            className,
            {
                [theme!['dropDown__btn--withChevron']]: showDropDownToggle
            }
        );

        // const emptyFn = () => null;

        return (
            <div
                {...rest}
                role="button"
                onClick={disabled ? null : toggleDropDown}
                // ref={shouldKeepFocusState ? _refHandler(isOpen) : emptyFn}
                className={finalClassName}
                aria-haspopup="true"
                >
                {children}
                {showDropDownToggle && <IconComponent icon={iconName} className={theme!.dropDown__chevron} {...iconRest!} />}
            </div>
        );
    }
}

export default ShallowDropDownHeader;
