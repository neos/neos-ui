import React, {PureComponent, ReactElement} from 'react';
import PropTypes from 'prop-types';
import StatelessToggablePanel, {ToggleablePanelTheme} from './statelessToggablePanel';

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
     * The children, ideally one Header and Contents component each.
     */
    children: ReactElement[],

    /**
     * The handler which will be called once the user toggles the contents.
     */
    onPanelToggle: () => void

    theme: ToggleablePanelTheme
}

export default class ToggablePanel extends PureComponent<Props> {
    state = {
        isOpen: true
    };

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
         * The children, ideally one Header and Contents component each.
         */
        children: PropTypes.any.isRequired,

        /**
         * The handler which will be called once the user toggles the contents.
         */
        onPanelToggle: PropTypes.func
    };

    static defaultProps = {
        isOpen: true
    };

    UNSAFE_componentWillReceiveProps(newProps: Props) {
        const {isOpen} = newProps;
        const isStateLess = Boolean(newProps.onPanelToggle);

        if (isOpen !== this.state.isOpen && !isStateLess) {
            this.setState({isOpen});
        }
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    render() {
        //
        // If the `onPanelToggle` prop is provided, the component will not
        // be using internal state, instead it will be controlled by the props.
        //
        const isStateLess = Boolean(this.props.onPanelToggle);
        const onPanelToggle = isStateLess ? this.props.onPanelToggle : this.toggle;
        const isOpen = isStateLess ? this.props.isOpen : this.state.isOpen;

        return (
            <StatelessToggablePanel
                {...this.props}
                isOpen={isOpen}
                onPanelToggle={onPanelToggle}
                >
                {this.props.children}
            </StatelessToggablePanel>
        );
    }
}
