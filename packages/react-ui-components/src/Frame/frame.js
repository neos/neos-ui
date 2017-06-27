import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash.omit';
import ReactDOM from 'react-dom';

export default class Frame extends PureComponent {
    static propTypes = {
        mountTarget: PropTypes.string.isRequired,
        contentDidUpdate: PropTypes.func.isRequired,
        children: PropTypes.node
    };

    render() {
        const rest = omit(this.props, [
            'mountTarget',
            'contentDidUpdate',
            'theme',
            'children'
        ]);

        return <iframe {...rest}/>;
    }
    componentWillMount() {
        document.addEventListener('Neos.Neos.Ui.ContentReady', this.renderFrameContents);
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
