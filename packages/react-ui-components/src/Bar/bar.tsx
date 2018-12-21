import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';

type BarPosition = 'top' | 'bottom';

interface BarTheme {
    readonly 'bar': string;
    readonly 'bar--top': string;
    readonly 'bar--bottom': string;
}

export interface BarProps {
    /**
     * This prop controls the vertical positioning of the Bar.
     */
    readonly position: BarPosition;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: BarTheme;

    /**
     * An optional `className` to attach to the wrapper.
     */
    readonly className?: string;

    /**
     * The contents to be rendered within the `Bar`.
     */
    readonly children: React.ReactNode;
}

class Bar extends PureComponent<BarProps> {
    public render(): JSX.Element {
        const {position, className, theme, children, ...rest} = this.props;
        const finalClassName = mergeClassNames(
            className,
            theme!.bar,
            {
                [theme!['bar--top']]: position === 'top',
                [theme!['bar--bottom']]: position === 'bottom'
            }
        );

        // TODO:
        //  The prop 'rest' is empty here. I suppose it contains all the attributes that are not part of the Badge Api/Interface.
        //  Consider enxtending Bagde with React.HTMLAttributes<HTMLDivElement> like we did in the Button component.
        //  It also enables autocomplete for the whole div Api.
        //  Consider this for the other components.
        return (
            <div className={finalClassName} {...rest}>
                {children}
            </div>
        );
    }
}

export default Bar;
