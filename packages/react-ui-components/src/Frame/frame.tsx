import {omit} from 'lodash';
import React, {PureComponent, ReactNode, SyntheticEvent} from 'react';
import ReactDOM from 'react-dom';

export interface FrameProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
    readonly src: string;
    readonly mountTarget: string;
    readonly contentDidUpdate: (window: Window, document: Document, mountTarget: Element) => void;
    readonly onLoad: (event: SyntheticEvent<HTMLIFrameElement>) => void;
    readonly onUnload: () => void;
    readonly children: ReactNode;
}

interface FrameState {
    readonly transitioning: boolean;
    readonly location: string;
}

const initialState: FrameState = {
    transitioning: false,
    location: '',
};
export default class Frame extends PureComponent<FrameProps> {
    // tslint:disable-next-line:readonly-keyword
    private ref?: HTMLIFrameElement;
    public readonly state = initialState;

    public render(): JSX.Element {
        const rest = omit(this.props, [
            'mountTarget',
            'contentDidUpdate',
            'theme',
            'children',
            'onLoad',
            'onUnload',
            'src'
        ]);

        return (
            <iframe ref={this.handleReference} {...rest} onLoad={this.handleLoad}>
                {this.renderFrameContents()}
            </iframe>
        );
    }

    private readonly handleReference = (ref: HTMLIFrameElement) => {
        // tslint:disable-next-line:no-object-mutation
        this.ref = ref;
    }

    public componentDidMount(): void {
        this.updateIframeUrlIfNecessary();
        this.addClickListener();
    }

    private readonly addClickListener = () => {
        if (this.ref && this.ref.contentDocument && this.ref.contentWindow) {
            this.ref.contentDocument.removeEventListener('click', this.relayClickEventToHostDocument);
            this.ref.contentDocument.addEventListener('click', this.relayClickEventToHostDocument);
            this.ref.contentWindow.addEventListener('unload', () => {
                this.handleUnload();
            });
        }
    }

    private readonly removeClickListener = () => {
        if (this.ref && this.ref.contentDocument) {
            this.ref.contentDocument.removeEventListener('click', this.relayClickEventToHostDocument);
        }
    }

    private readonly relayClickEventToHostDocument = (e: MouseEvent) => {
        const hostEvent: any = new MouseEvent(e.type);
        // Needed for enhanceWithClickOutside
        hostEvent.iframeTarget = e.target;
        window.document.dispatchEvent(hostEvent);
    }

    public UNSAFE_componentWillUpdate(): void {
        this.removeClickListener();
    }

    public componentDidUpdate(): void {
        this.updateIframeUrlIfNecessary();
        this.addClickListener();
    }

    // We do not use react's magic to change to a different URL in the iFrame, but do it
    // explicitely (in order to avoid reloads if we are already on the correct page)
    private updateIframeUrlIfNecessary(): void {
        if (!this.ref || this.props.src === this.state.location) {
            return;
        }

        try {
            const win = this.ref.contentWindow; // eslint-disable-line react/no-find-dom-node
            if (win && win.location.href !== this.props.src) {
                this.setState({
                    transitioning: true,
                    location: this.props.src,
                });
                win.location.replace(this.props.src);
            }
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.error('Could not update iFrame Url from within. Trying to set src attribute manually...');
            this.ref.setAttribute('src', this.props.src);
        }
    }

    public UNSAFE_componentWillMount(): void {
        document.addEventListener('Neos.Neos.Ui.ContentReady', () => {
            if (this.ref && this.ref.contentDocument && this.ref.contentWindow) {
                const doc = this.ref.contentDocument;
                const win = this.ref.contentWindow;
                const mountTarget = doc.querySelector(this.props.mountTarget);
                if (mountTarget) {
                    this.props.contentDidUpdate(win, doc, mountTarget);
                }
            }
        });
    }

    private readonly handleUnload = () => {
        this.setState({
            transitioning: true
        });
    }

    private readonly handleLoad = (e: SyntheticEvent<HTMLIFrameElement>) => {
        this.setState({
            transitioning: false
        });

        const {onLoad} = this.props;

        if (typeof onLoad === 'function' && this.ref) {
            onLoad(e);
        }
    }

    private readonly renderFrameContents = () => {
        if (this.state.transitioning) {
            // Don't render the UI inside contentCanvas while transitioning.
            // Doing so may cause "Permission denied" errors in IE & Edge
            return null;
        }
        if (this.ref) {
            const doc = this.ref.contentDocument;
            const win = this.ref.contentWindow;

            if (win && doc) {
                win.addEventListener('unload', this.props.onUnload);

                const mountTarget = doc.querySelector(this.props.mountTarget);
                const contents = React.createElement('div', undefined, this.props.children);
                const iframeHtml = doc.querySelector('html');

                if (iframeHtml) {
                    // Center iframe
                    iframeHtml.style.setProperty('margin', '0 auto');
                }

                if (mountTarget) {
                    return ReactDOM.createPortal(contents, mountTarget);
                }
            }
        }
        return null;
    }

    public componentWillUnmount(): void {
        if (this.ref) {
            document.removeEventListener('Neos.Neos.Ui.ContentReady', this.renderFrameContents);
        }
        this.removeClickListener();
    }
}
