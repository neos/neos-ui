import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import CSSPropertyOperations from 'react/lib/CSSPropertyOperations';
import shallowCompare from 'react/lib/shallowCompare';

export default class Portal extends Component {
    static propTypes = {
        // The target ID in which the children will be rendered into.
        // If no `targetId` was specified, the children will be rendered into the <body> element.
        targetId: PropTypes.string,

        // The children to render in the <Portal />.
        children: PropTypes.element.isRequired,

        // The className of the <Portal />
        className: PropTypes.string,
        style: PropTypes.object,

        // The boolean over which you can control the rendered state of the <Portal />.
        isOpened: PropTypes.bool
    };

    constructor() {
        super();

        this.state = {
            active: false
        };
        this.portal = null;
        this.node = null;
    }

    componentDidMount() {
        if (this.props.isOpened) {
            this.openPortal();
        }
    }

    componentWillReceiveProps(newProps) {
        // portal's 'is open' state is handled through the prop isOpened
        if (typeof newProps.isOpened !== 'undefined') {
            if (newProps.isOpened) {
                if (this.state.active) {
                    this.renderPortal(newProps);
                } else {
                    this.openPortal(newProps);
                }
            }
            if (!newProps.isOpened && this.state.active) {
                this.closePortal();
            }
        }

        // portal handles its own 'is open' state
        if (typeof newProps.isOpened === 'undefined' && this.state.active) {
            this.renderPortal(newProps);
        }
    }

    componentWillUnmount() {
        this.closePortal();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    renderPortal(props) {
        const portalWrapper = this.getPortalWrapper(props);

        if (!this.node) {
            this.node = document.createElement('div');

            if (props.className) {
                this.node.className = props.className;
            }

            if (props.style) {
                CSSPropertyOperations.setValueForStyles(this.node, props.style);
            }

            portalWrapper.appendChild(this.node);
        }

        this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(this, React.cloneElement(props.children, {closePortal: this.closePortal}), this.node);
    }

    render() {
        return null;
    }

    openPortal(props = this.props, event) {
        try {
            event.preventDefault();
            event.stopPropagation();
        } catch (e) {}

        this.setState({active: true});
        this.renderPortal(props);
    }

    closePortal() {
        const portalWrapper = this.getPortalWrapper(this.props);
        const resetPortalState = () => {
            if (this.node) {
                ReactDOM.unmountComponentAtNode(this.node);
                portalWrapper.removeChild(this.node);
            }

            this.portal = null;
            this.node = null;
            this.setState({active: false});
        };

        resetPortalState(this.node);
    }

    getPortalWrapper(props = this.props) {
        const {targetId} = props;

        return targetId ? document.getElementById(targetId) : document.body;
    }
}
