import React, {JSXElementConstructor, PureComponent, ReactNode} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {HeadlineProps} from '../Headline/headline';
import {IconButtonProps} from '../IconButton/iconButton';

type Props = {
    /**
     * The children which will be rendered within the header.
     */
    children: ReactNode,

    /**
     * The propagated isOpen state from the toggle panel
     */
    isPanelOpen?: boolean

    /**
     * An optional css theme to be injected.
     */
    theme: {
        'panel__headline': string
        'panel__headline--noPadding': string
        'panel__toggleBtn': string
    }

    /**
     * Can be set to remove padding from the content area
     */
    noPadding?: boolean

    /**
     * Static component dependencies which are injected from the outside (index.js)
     */
    HeadlineComponent: JSXElementConstructor<HeadlineProps>
    IconButtonComponent: JSXElementConstructor<IconButtonProps>

    /**
     * Optional icons as closing/opening indicator
     * If not provided defaults are chevron-up and chevron-down
     */
    openedIcon: string
    closedIcon: string
    toggleButtonId?: string
}

export default class Header extends PureComponent<Props> {
    static propTypes = {
        /**
         * The children which will be rendered within the header.
         */
        children: PropTypes.any.isRequired,

        /**
         * The propagated isOpen state from the toggle panel
         */
        isPanelOpen: PropTypes.bool,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'panel__headline': PropTypes.string,
            'panel__headline--noPadding': PropTypes.string,
            'panel__toggleBtn': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        /**
         * Can be set to remove padding from the content area
         */
        noPadding: PropTypes.bool,

        /**
         * Static component dependencies which are injected from the outside (index.js)
         */
        HeadlineComponent: PropTypes.any.isRequired,
        IconButtonComponent: PropTypes.any.isRequired,

        /**
         * Optional icons as closing/opening indicator
         * If not provided defaults are chevron-up and chevron-down
         */
        openedIcon: PropTypes.string,
        closedIcon: PropTypes.string,
        toggleButtonId: PropTypes.string
    };

    static defaultProps = {
        isPanelOpen: true,
        openedIcon: 'chevron-circle-up',
        closedIcon: 'chevron-circle-down'
    }

    static contextTypes = {
        onPanelToggle: PropTypes.func.isRequired
    };

    render() {
        const {
            HeadlineComponent,
            IconButtonComponent,
            children,
            isPanelOpen,
            openedIcon,
            closedIcon,
            theme,
            noPadding,
            toggleButtonId,
            ...rest
        } = this.props;
        const {onPanelToggle} = this.context;

        const finalClassName = mergeClassNames([theme.panel__headline], {
            [theme['panel__headline--noPadding']]: noPadding
        });

        return (
            <div role="button" aria-expanded={isPanelOpen} onClick={onPanelToggle} {...rest}>
                <HeadlineComponent
                    className={finalClassName}
                    type="h2"
                >
                    {children}
                </HeadlineComponent>
                <IconButtonComponent
                    className={theme.panel__toggleBtn}
                    hoverStyle="clean"
                    icon={isPanelOpen ? openedIcon : closedIcon}
                    id={toggleButtonId}
                />
            </div>
        );
    }
}
