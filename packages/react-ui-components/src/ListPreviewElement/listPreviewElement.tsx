import mergeClassNames from 'classnames';
import React, {PureComponent, ReactNode} from 'react';

import Icon from '../Icon';
import {PickDefaultProps} from '@neos-project/react-ui-components/types';

export interface ListPreviewElementProps {
    // ------------------------------
    // API inside custom ListPreviewElements
    // ------------------------------
    readonly icon?: string;
    readonly className?: string;
    readonly disabled?: boolean;
    readonly isHighlighted?: boolean;
    readonly onClick?: () => void;
    readonly onMouseEnter?: () => void;
    readonly children?: ReactNode;

    // ------------------------------
    // Theme & Dependencies
    // ------------------------------
    readonly theme?: ListPreviewElementTheme;
}

interface ListPreviewElementTheme {
    readonly 'listPreviewElement': string;
    readonly 'listPreviewElement--isHighlighted': string;
    readonly 'listPreviewElement--isDisabled': string;
    readonly 'listPreviewElement__icon': string;
}

const defaultProps: PickDefaultProps<ListPreviewElementProps, 'isHighlighted'> = {
    isHighlighted: false,
};

/**
 * The ListPreviewElement is responsible for rendering a single element in a Select Box
 * or a MultiSelectBox.
 *
 * It encapsulates basic styling and functionality needed by the SelectBox / MultiSelectBox.
 *
 * **Instead of directly using this component, you might want to use SelectBox_Option_SingleLine
 * or SelectBox_Option_MultiLineWithThumbnail instead, as these provide default styling.**
 *
 * Often, you will create your own ListPreviewElements, taking this element as a basis like the following:
 * ```
 * const MySpecialPreviewElement = props => {
 *      return (
 *          <ListPreviewElement {...props} icon={props.yourIconHere}>
 *               ... your content here ...
 *          </ListPreviewElement>
 *      );
 * }
 * ```
 */
export default class ListPreviewElement extends PureComponent<ListPreviewElementProps> {
    public static readonly defaultProps = defaultProps;

    public render(): JSX.Element {
        const {
            icon,
            className,
            disabled,
            children,

            isHighlighted,

            theme,
        } = this.props;

        const optionClassName = mergeClassNames(
            theme!.listPreviewElement,
            {
                [theme!['listPreviewElement--isHighlighted']]: isHighlighted,
                [theme!['listPreviewElement--isDisabled']]: disabled,
            },
            className
        );

        return (
            <div
                onMouseEnter={this.handleMouseEnter}
                onClick={this.handleClick}
                className={optionClassName}
                role="button"
            >
                {Boolean(icon) && <Icon className={theme!.listPreviewElement__icon} icon={icon!}/>}
                {children}
            </div>
        );
    }

    private readonly handleMouseEnter = () => {
        if (!this.props.disabled && this.props.onMouseEnter) {
            this.props.onMouseEnter();
        }
    }

    private readonly handleClick = () => {
        if (!this.props.disabled && this.props.onClick) {
            this.props.onClick();
        }
    }
}
