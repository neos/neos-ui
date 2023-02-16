import React, {PureComponent, ReactNode} from 'react';
import PropTypes from 'prop-types';
import {Collapse} from 'react-collapse';
import mergeClassNames from 'classnames';

type Props = {
    /**
     * An optional className to be rendered on the wrapping node.
     */
    className?: string

    /**
     * Can be set to remove padding from the content area
     */
    noPadding?: boolean,

    /**
     * The rendered children which can be toggled.
     */
    children: ReactNode,

    /**
     * The propagated isOpen state from the toggle panel
     */
    isPanelOpen: boolean,

    /**
     * An optional css theme to be injected.
     */
    theme: {
        'panel__contents': string
        'panel__contents--noPadding': string
    }
}

export default class Contents extends PureComponent<Props> {
    static propTypes = {
        /**
         * An optional className to be rendered on the wrapping node.
         */
        className: PropTypes.string,

        /**
         * Can be set to remove padding from the content area
         */
        noPadding: PropTypes.bool,

        /**
         * The rendered children which can be toggled.
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
            'panel__contents': PropTypes.string,
            'panel__contents--noPadding': PropTypes.string
        }).isRequired/* eslint-enable quote-props */
    };

    static defaultProps = {
        theme: {},
        isPanelOpen: true
    };

    render() {
        const {
            className,
            children,
            isPanelOpen,
            theme
        } = this.props;

        const finalClassName = mergeClassNames(
            theme.panel__contents,
            {
                [theme['panel__contents--noPadding']]: this.props.noPadding
            },
            className
        );

        return (
            // @ts-ignore -- FIXME wrong typings in 'react-collapse'?
            <Collapse isOpened={isPanelOpen} springConfig={{stiffness: 300, damping: 30}}>
                <div className={finalClassName} aria-hidden={isPanelOpen ? 'false' : 'true'}>
                    {children}
                </div>
            </Collapse>
        );
    }
}
