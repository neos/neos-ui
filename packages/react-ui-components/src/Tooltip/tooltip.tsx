import React, {PureComponent, ReactNode} from 'react';
import mergeClassNames from 'classnames';
import {PickDefaultProps} from '../../types';

export interface TooltipProps {
    /**
     * An optional className to render on the tooltip node.
     */
    readonly className?: string;

    /**
     * The children to render within the tooltip node.
     */
    readonly children?: ReactNode;

    /**
     * If set to true the tooltip won't be positioned absolute but relative and
     * show up inline
     */
    readonly renderInline?: boolean;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: TooltipTheme;

    /**
     * Whether this tooltip should indicate an error or not
     */
    readonly asError?: boolean;
}

interface TooltipTheme {
    readonly tooltip: string;
    readonly 'tooltip--asError': string;
    readonly 'tooltip--inline': string;
    readonly 'tooltip--arrow': string;
    readonly 'tooltip--inner': string;
}

export const defaultProps: PickDefaultProps<TooltipProps, 'renderInline'> = {
    renderInline: false,
};

export default class Tooltip extends PureComponent<TooltipProps> {
    public static defaultProps = defaultProps;

    public render(): JSX.Element {
        const {
            children,
            className,
            theme,
            renderInline,
            asError,
            ...rest
        } = this.props;
        const classNames = mergeClassNames(
            theme!.tooltip,
            {
                [theme!['tooltip--asError']]: asError,
                [theme!['tooltip--inline']]: renderInline,
            },
            className
        );

        return (
            <div {...rest} className={classNames}>
                <div className={theme!['tooltip--arrow']}/>
                <div className={theme!['tooltip--inner']}>
                    {children}
                </div>
            </div>
        );
    }
}
