// 98997e98ea6d5ececc49db0de528151e40e272b7 from https://github.com/ryanseddon/react-frame-component/commit/98997e98ea6d5ececc49db0de528151e40e272b7 - and then modified!
import React from 'react';
import omit from 'lodash.omit';
import ReactDOM from 'react-dom';
import assign from 'object-assign';

const hasConsole = typeof window !== 'undefined' && window.console;
const noop = function () {};
let swallowInvalidHeadWarning = noop;
let resetWarnings = noop;

if (hasConsole) {
    const originalError = console.error;
    // Rendering a <head> into a body is technically invalid although it
    // works. We swallow React's validateDOMNesting warning if that is the
    // message to avoid confusion
    swallowInvalidHeadWarning = () => {
        console.error = msg => {
            if (/<head>/.test(msg)) {
                return;
            }
            originalError.call(console, msg);
        };
    };
    resetWarnings = () => {
        console.error = originalError;
    };
}

const Frame = React.createClass({
    // React warns when you render directly into the body since browser extensions
    // also inject into the body and can mess up React. For this reason
    // initialContent initialContent is expected to have a div inside of the body
    // element that we render react into.
    propTypes: {
        style: React.PropTypes.object,
        head: React.PropTypes.node,
        initialContent: React.PropTypes.string,
        mountTarget: React.PropTypes.string,
        contentDidUpdate: React.PropTypes.func,
        children: React.PropTypes.node
    },
    getDefaultProps() {
        return {
            initialContent: '<!DOCTYPE html><html><head></head><body><div></div></body></html>',
            contentDidUpdate: () => null
        };
    },
    render() {
        // The iframe isn't ready so we drop children from props here. #12, #17
        const rest = omit(this.props, [
            'mountTarget',
            'contentDidUpdate',
            'contentDidMount',
            'theme',
            'initialContent'
        ]);

        return React.createElement('iframe', assign({}, rest, {children: undefined}));
    },
    componentWillMount() {
        document.addEventListener('Neos.Content.Ready', () => this.renderFrameContents());
    },
    renderFrameContents() {
        const doc = ReactDOM.findDOMNode(this).contentDocument; // eslint-disable-line react/no-find-dom-node
        const win = ReactDOM.findDOMNode(this).contentWindow; // eslint-disable-line react/no-find-dom-node
        // TODO: doc.readyState seems to be *always* true in Chrome at least; so we check whether the querySelectors exist.
        const contents = React.createElement('div',
            undefined,
            this.props.head,
            this.props.children
        );

        swallowInvalidHeadWarning();

        // unstable_renderSubtreeIntoContainer allows us to pass this component as
        // the parent, which exposes context to any child components.
        const callback = this.props.contentDidUpdate;
        let mountTarget;

        if (this.props.mountTarget) {
            mountTarget = doc.querySelector(this.props.mountTarget);
        } else {
            mountTarget = doc.body.children[0];
        }

        ReactDOM.unstable_renderSubtreeIntoContainer(this, contents, mountTarget, () => {
            callback(win, doc, mountTarget);
        });

        resetWarnings();
    },
    componentWillUnmount() {
        const doc = ReactDOM.findDOMNode(this).contentDocument; // eslint-disable-line react/no-find-dom-node
        if (doc) {
            ReactDOM.unmountComponentAtNode(doc.body);
        }
    }
});

module.exports = Frame;
