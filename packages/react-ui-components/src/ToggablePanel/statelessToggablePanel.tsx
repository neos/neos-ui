import React, {PureComponent, ReactElement} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

export const validStyleKeys = ['condensed'] as const;

export type ToggleablePanelTheme = {
    'panel': string,
    'panel--isOpen': string,
    'panel--condensed': string
}

type Props = {
    /**
     * This prop controls if the contents are visible or not.
     */
    isOpen?: boolean

    /**
     * Switches icon-open and icon-closed if set to true; can be used for
     * panels that close downwards such as the page structure tree.
     */
    closesToBottom?: boolean

    /**
     * An optional className to render on the wrapper.
     */
    className?: string

    /**
     * The children, ideally one Header and Contents component each.
     */
    children: ReactElement[]

    /**
     * The handler which will be called once the user toggles the contents.
     */
    onPanelToggle: () => void

    /**
     * An optional css theme to be injected.
     */
    theme: ToggleablePanelTheme

    /**
     * The `style` prop defines the regular visual style of the `Button`.
     * TODO: Get the type literals from 'validStyleKeys'
     */
    style?: 'condensed'
}

export default class StatelessToggablePanel extends PureComponent<Props> {
    static propTypes = {
        /**
         * This prop controls if the contents are visible or not.
         */
        isOpen: PropTypes.bool,

        /**
         * Switches icon-open and icon-closed if set to true; can be used for
         * panels that close downwards such as the page structure tree.
         */
        closesToBottom: PropTypes.bool,

        /**
         * An optional className to render on the wrapper.
         */
        className: PropTypes.string,

        /**
         * The children, ideally one Header and Contents component each.
         */
        children: PropTypes.any.isRequired,

        /**
         * The handler which will be called once the user toggles the contents.
         */
        onPanelToggle: PropTypes.func.isRequired,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'panel': PropTypes.string,
            'panel--isOpen': PropTypes.string,
            'panel--condensed': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        /**
         * The `style` prop defines the regular visual style of the `Button`.
         */
        style: PropTypes.oneOf(validStyleKeys)
    };

    static defaultProps = {
        isOpen: false
    };

    static childContextTypes = {
        onPanelToggle: PropTypes.func.isRequired
    };

    getChildContext() {
        return {
            onPanelToggle: this.props.onPanelToggle
        };
    }

    render() {
        const {children, className, theme, style, isOpen} = this.props;
        const finalClassName = mergeClassNames(className, {
            [theme.panel]: true,
            [theme['panel--isOpen']]: isOpen,
            [theme[`panel--${style!}`]]: style && validStyleKeys.includes(style)
        });

        return (
            <section className={finalClassName}>
                {React.Children.map(
                    children,
                    child => child.type ? <child.type {...child.props} isPanelOpen={isOpen}/> : child
                )}
            </section>
        );
    }
}
