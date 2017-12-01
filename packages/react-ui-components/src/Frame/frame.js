import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';
import ReactDOM from 'react-dom';

export default class Frame extends PureComponent {
    static propTypes = {
        src: PropTypes.string,
        mountTarget: PropTypes.string.isRequired,
        contentDidUpdate: PropTypes.func.isRequired,
        onLoad: PropTypes.func,
        children: PropTypes.node
    };

    handleReference = ref => {
        this.ref = ref;
    };

    componentDidMount() {
        this.updateIframeUrlIfNecessary();
    }

    componentDidUpdate() {
        this.updateIframeUrlIfNecessary();
    }

    // we do not use react's magic to change to a different URL in the iFrame, but do it
    // explicitely (in order to avoid reloads if we are already on the correct page)
    updateIframeUrlIfNecessary() {
        if (!this.ref) {
            return;
        }

        try {
            const win = this.ref.contentWindow; // eslint-disable-line react/no-find-dom-node
            if (win.location.href !== this.props.src) {
                win.location = this.props.src;
            }
        } catch (err) {
            console.error(`Could not update iFrame Url from within. Trying to set src attribute manually...`);
            this.ref.setAttribute('src', this.props.src);
        }
    }

    render() {
        const rest = omit(this.props, [
            'mountTarget',
            'contentDidUpdate',
            'theme',
            'children',
            'onLoad',
            'src'
        ]);

        return <iframe ref={this.handleReference} onLoad={this.handleLoad} {...rest}/>;
    }

    componentWillMount() {
        document.addEventListener('Neos.Neos.Ui.ContentReady', this.renderFrameContents);
    }

    handleLoad = () => {
        const {onLoad} = this.props;

        if (typeof onLoad === 'function') {
            onLoad(this.ref);
        }
    }

    renderFrameContents = () => {
        const doc = ReactDOM.findDOMNode(this).contentDocument; // eslint-disable-line react/no-find-dom-node
        const win = ReactDOM.findDOMNode(this).contentWindow; // eslint-disable-line react/no-find-dom-node
        const mountTarget = doc.querySelector(this.props.mountTarget);
        const contents = React.createElement('div', undefined, this.props.children);

        ReactDOM.unstable_renderSubtreeIntoContainer(this, contents, mountTarget, () => {
            this.props.contentDidUpdate(win, doc, mountTarget);
        });
    }

    componentWillUnmount() {
        const doc = ReactDOM.findDOMNode(this).contentDocument; // eslint-disable-line react/no-find-dom-node
        document.removeEventListener('Neos.Neos.Ui.ContentReady', this.renderFrameContents);
        if (doc) {
            ReactDOM.unmountComponentAtNode(doc.body);
        }
    }
}
