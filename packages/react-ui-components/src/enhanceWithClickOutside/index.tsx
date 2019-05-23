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

                /**
                 * Ignore target if it has the data attribute data-ignore_click_outside
                 * with value true. We skip the click outside handling. For further information
                 *
                 * What happend:
                 *
                 * When you create a new node that has an empty renderedContent in RenderContentOutOfBand
                 * response, the UI throw an error and reloads the GuestFrame.
                 * This behavior is intended but lead to the error that it was not possible to use the NodeToolBar
                 * after that reload on each node without reloading the whole window or changing the preview mode.
                 *
                 * Problem:
                 *
                 * We found out that we have an issue with the reload of the guestframe when it is triggered from
                 * inside the guest frame. The events are all fired, but not in the right order.
                 * So we want to handle the "click outside handling" when you click on the "add Node" Button to close
                 * dropdowns like the publishing. But now we have the issue that the that the saga for the
                 * nodeCreationWorkflow is fired to early and we close the dialog we just opened with
                 * the "click outside handling" of the "add node" button.
                 * We did not find a proper way to change the event order, yet. At the moment we add a
                 * data-attribute to detect that we triggered the "click outside handling" from the NodeToolBar inside the
                 * GuestFrame and skip the event.
                 *
                 * So it can happen that you have a opened publish drop down and it does not close when you open the
                 * node creation dialog. But when you select the node type in the dialog the drop down will close.
                 * And in general the drop down is opened before you click the "add node" button. Because you need
                 * to click on the node to get the NodeToolBar and then the dialog will close.
                 */
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
