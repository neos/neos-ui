import React from 'react';
import ReactDOM from 'react-dom';

interface InnerComponent extends React.Component {
    readonly handleClickOutside?: (e: MouseEvent | TouchEvent) => void;
}

const isTargetExcludedForClickOutside : (el: any) => boolean = el => {
    if (!el) {
        // top level: the targt is not excluded
        return false;
    }

    return (el.dataset && el.dataset.ignore_click_outside) ? true : isTargetExcludedForClickOutside(el.parentNode);
};

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

                // if the iframeTarget is set, we ignore the event's target, as there might
                // be rubbish in there.
                const target = e.iframeTarget || e.target;

                // Ignore target if it has the data attribute data-ignore_click_outside
                // with value true. We skip the click outside handling. For further information
                // take look at https://github.com/neos/neos-ui/issues/2489
                if (isTargetExcludedForClickOutside(target)) {
                    return;
                }

                if (
                    (!domNode || !domNode.contains(target)) &&
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

    (EnhancedComponent as any).displayName = `clickOutside(${Component.displayName || Component.name})`;

    return EnhancedComponent;
};

export default enhanceWithClickOutside;
