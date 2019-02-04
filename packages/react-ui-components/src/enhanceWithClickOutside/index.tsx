import React from 'react';
import ReactDOM from 'react-dom';

interface InnerComponent extends React.Component {
    readonly handleClickOutside?: (e: MouseEvent | TouchEvent) => void;
}

const enhanceWithClickOutside = <P extends {}>(Component: React.ComponentClass<P>): React.ComponentClass<P> => {
    class EnhancedComponent extends React.Component<P> {
        private wrappedInstanceRef = React.createRef<InnerComponent>();

        public componentDidMount(): void {
            document.addEventListener('click', this.handleClickOutside, true);
        }

        public componentWillUnmount(): void {
            document.removeEventListener('click', this.handleClickOutside, true);
        }

        private handleClickOutside = (e: any) => {
            if (
                this.wrappedInstanceRef.current &&
                (e.target instanceof HTMLElement || e.target instanceof HTMLDocument)
            ) {
                const domNode = ReactDOM.findDOMNode(this.wrappedInstanceRef.current);
                if (
                    (!domNode || (!domNode.contains(e.iframeTarget) && !domNode.contains(e.target))) &&
                    this.wrappedInstanceRef &&
                    this.wrappedInstanceRef.current &&
                    typeof this.wrappedInstanceRef.current.handleClickOutside === 'function'
                ) {
                    this.wrappedInstanceRef.current.handleClickOutside(e);
                }
            }
        }

        public render(): JSX.Element {
            return (
                <Component
                    {...this.props}
                    ref={this.wrappedInstanceRef}
                />
            );
        }
    }

    return EnhancedComponent;
};

export default enhanceWithClickOutside;
