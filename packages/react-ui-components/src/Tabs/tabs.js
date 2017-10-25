import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';
import mergeClassNames from 'classnames';
import Tooltip from './../Tooltip/index.js';

export default class Tabs extends PureComponent {
    static propTypes = {
        /**
         * The index of the active tab, defaults to 0.
         */
        activeTab: PropTypes.number,

        /**
         * An optional className to render on the wrapping div.
         */
        className: PropTypes.string,

        /**
         * The children panels to render.
         */
        children: PropTypes.any.isRequired,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'tabs': PropTypes.string,
            'tabs__content': PropTypes.string,
            'tabNavigation': PropTypes.string,
            'tabNavigation__item': PropTypes.string,
            'tabNavigation__item--isActive': PropTypes.string,
            'tabNavigation__itemBtn': PropTypes.string,
            'tabNavigation__itemBtnIcon': PropTypes.string
        }).isRequired,

        /**
         * Static component dependencies which are injected from the outside (index.js)
         */
        IconComponent: PropTypes.any.isRequired
    };

    static defaultProps = {
        activeTab: 0
    };

    constructor(props) {
        super(props);

        this.handleTabNavItemClick = this.activateTabForIndex.bind(this);
        this.state = {activeTab: props.activeTab};
    }

    componentWillReceiveProps(newProps) {
        const newActiveTab = newProps.activeTab;
        const {activeTab} = this.state;

        if (newActiveTab && newActiveTab !== activeTab) {
            this.setState({
                activeTab: newActiveTab
            });
        }
    }

    render() {
        const {theme, className} = this.props;
        const finalClassName = mergeClassNames(theme.tabs, className);

        return (
            <div className={finalClassName} role="tablist">
                {this.renderMenuItems()}
                {this.renderPanels()}
            </div>
        );
    }

    getActiveTab() {
        // If activeTab is out of bounds, choose the first tab
        const {activeTab} = this.state;
        const childrenCount = React.Children.count(this.props.children);
        return childrenCount < activeTab + 1 ? 0 : activeTab;
    }

    renderMenuItems() {
        const {
            IconComponent,
            theme,
            children
        } = this.props;
        const activeTab = this.getActiveTab();

        const menuItems = React.Children.map(children, (panel, index) => (
            <TabMenuItem
                key={index}
                index={index}
                ref={`tab-${index}`}
                onClick={this.handleTabNavItemClick}
                isActive={activeTab === index}
                IconComponent={IconComponent}
                theme={theme}
                title={panel.props.title}
                tooltipLabel={panel.props.tooltipLabel}
                icon={panel.props.icon}
                />
        ));

        return (
            <ul className={theme.tabNavigation}>
                {menuItems}
            </ul>
        );
    }

    activateTabForIndex(index) {
        this.setState({activeTab: index});
    }

    renderPanels() {
        const {theme, children} = this.props;
        const activeTab = this.getActiveTab();

        return (
            <div className={theme.tabs__content}>
                {React.Children.map(children, (panel, index) => {
                    const isActive = activeTab === index;
                    const style = {
                        display: isActive ? 'block' : 'none'
                    };

                    return (
                        <div
                            key={index}
                            style={style}
                            role="tabpanel"
                            aria-hidden={isActive ? 'false' : 'true'}
                            >
                            {panel}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export class TabMenuItem extends PureComponent {
    static propTypes = {
        /**
         * The index which will be handed over to the onClick handler.
         */
        index: PropTypes.number.isRequired,

        /**
         * The title to render for the given Panel.
         */
        title: PropTypes.string,

        /**
         * An optional label to show in a tooltip. Can be either a string or
         * any children/component
         */
        tooltipLabel: PropTypes.any,

        /**
         * The click handler which will be called with the passed index as it's only argument.
         */
        onClick: PropTypes.func.isRequired,

        /**
         * A boolean which controls if the rendered anchor is displayed as active or not.
         */
        isActive: PropTypes.bool,

        /**
         * An optional icon identifier, if one is passed, an Icon will be rendered besides the title.
         */
        icon: PropTypes.string,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'tabNavigation__item': PropTypes.string,
            'tabNavigation__item--isActive': PropTypes.string,
            'tabNavigation__itemBtn': PropTypes.string,
            'tabNavigation__itemBtnIcon': PropTypes.string
        }).isRequired,

        /**
         * Static component dependencies which are injected from the outside (index.js)
         */
        IconComponent: PropTypes.any.isRequired
    };

    static defaultProps = {
        isActive: false
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const {
            theme,
            isActive,
            index,
            IconComponent,
            tooltipLabel,
            icon,
            title,
            ...restProps
        } = this.props;
        const rest = omit(restProps, ['onClick']);
        const finalClassName = mergeClassNames({
            [theme.tabNavigation__item]: true,
            [theme['tabNavigation__item--isActive']]: isActive
        });
        const finalIconClassName = mergeClassNames({
            [theme.tabNavigation__itemBtnIcon]: true,
            [theme['tabNavigation__itemBtnIcon--hasLabel']]: title && title.length
        });

        return (
            <li className={finalClassName} role="presentation" {...rest}>
                <Tooltip tooltipLabel={tooltipLabel} tooltipPosition="right">
                    <button
                        className={theme.tabNavigation__itemBtn}
                        onClick={this.handleClick}
                        role="tab"
                        aria-selected={isActive ? 'true' : 'false'}
                        aria-controls={`section${index}`}
                        >
                        {icon ? <IconComponent icon={icon} className={finalIconClassName}/> : null}
                        {title}
                    </button>
                </Tooltip>
            </li>
        );
    }

    handleClick() {
        this.props.onClick(this.props.index);
    }
}
