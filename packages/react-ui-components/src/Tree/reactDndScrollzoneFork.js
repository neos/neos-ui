// This is a vendored fork of react-dnd-scrollzone, as the package itself seems unmaintained
// https://github.com/azuqua/react-dnd-scrollzone/pull/38#issuecomment-434385410

import React, {Component, createContext} from 'react';
import {DndContext} from 'react-dnd';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import throttle from 'lodash.throttle';
import hoist from 'hoist-non-react-statics';
import raf from 'raf';

const DragDropContextConsumer = DndContext.Consumer;

function getDisplayName(Component) {
    return (
        Component.displayName ||
        Component.name ||
        (typeof Component === 'string' && Component.length > 0 ? Component : 'Unknown')
    );
}

function noop() {}

function intBetween(min, max, val) {
    return Math.floor(
        Math.min(max, Math.max(min, val))
    );
}

function getCoords(evt) {
    if (evt.type === 'touchmove') {
        return {x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY};
    }

    return {x: evt.clientX, y: evt.clientY};
}

const DEFAULT_BUFFER = 150;

const useNewContextApi = createContext !== undefined && DragDropContextConsumer !== undefined;

function createDragDropMonitorWrapper(WrappedComponent) {
    return function DragDropMonitorWrapper(props) {
        return (
            <DragDropContextConsumer>
                {({dragDropManager}) =>
                    <WrappedComponent {...props} dragDropManager={dragDropManager} />
                }
            </DragDropContextConsumer>
        );
    };
}

export function createHorizontalStrength(_buffer) {
    return function defaultHorizontalStrength({x, w, y, h}, point) {
        const buffer = Math.min(w / 2, _buffer);
        const inRange = point.x >= x && point.x <= x + w;
        const inBox = inRange && point.y >= y && point.y <= y + h;

        if (inBox) {
            if (point.x < x + buffer) {
                return (point.x - x - buffer) / buffer;
            }
            if (point.x > (x + w - buffer)) {
                return -(x + w - point.x - buffer) / buffer;
            }
        }

        return 0;
    };
}

export function createVerticalStrength(_buffer) {
    return function defaultVerticalStrength({y, h, x, w}, point) {
        const buffer = Math.min(h / 2, _buffer);
        const inRange = point.y >= y && point.y <= y + h;
        const inBox = inRange && point.x >= x && point.x <= x + w;

        if (inBox) {
            if (point.y < y + buffer) {
                return (point.y - y - buffer) / buffer;
            }
            if (point.y > (y + h - buffer)) {
                return -(y + h - point.y - buffer) / buffer;
            }
        }

        return 0;
    };
}

export const defaultHorizontalStrength = createHorizontalStrength(DEFAULT_BUFFER);

export const defaultVerticalStrength = createVerticalStrength(DEFAULT_BUFFER);

export default function createScrollingComponent(WrappedComponent) {
    class ScrollingComponent extends Component {
        static displayName = `Scrolling(${getDisplayName(WrappedComponent)})`;

        static propTypes = {
            onScrollChange: PropTypes.func,
            verticalStrength: PropTypes.func,
            horizontalStrength: PropTypes.func,
            strengthMultiplier: PropTypes.number,
            getScrollContainer: PropTypes.func
        };

        static defaultProps = {
            onScrollChange: noop,
            verticalStrength: defaultVerticalStrength,
            horizontalStrength: defaultHorizontalStrength,
            strengthMultiplier: 30
        };

        static contextTypes = useNewContextApi ? undefined : {
            dragDropManager: PropTypes.object
        };

        constructor(props, ctx) {
            super(props, ctx);

            this.scaleX = 0;
            this.scaleY = 0;
            this.frame = null;

            this.attached = false;
            this.dragging = false;
        }

        componentDidMount() {
            const {getScrollContainer} = this.props;
            const wrappedNode = findDOMNode(this.wrappedInstance);
            this.container = getScrollContainer ? getScrollContainer(wrappedNode) : wrappedNode;
            this.container.addEventListener('dragover', this.handleEvent);
            // touchmove events don't seem to work across siblings, so we unfortunately
            // have to attach the listeners to the body
            window.document.body.addEventListener('touchmove', this.handleEvent);

            this.clearMonitorSubscription = this.getDragDropManager()
                    .getMonitor()
                    .subscribeToStateChange(() => this.handleMonitorChange());
        }

        componentWillUnmount() {
            this.container.removeEventListener('dragover', this.handleEvent);
            window.document.body.removeEventListener('touchmove', this.handleEvent);
            this.clearMonitorSubscription();
            this.stopScrolling();
        }

        getDragDropManager() {
            return useNewContextApi ? this.props.dragDropManager : this.context.dragDropManager;
        }

        handleEvent = evt => {
            if (this.dragging && !this.attached) {
                this.attach();
                this.updateScrolling(evt);
            }
        }

        handleMonitorChange() {
            const isDragging = this.getDragDropManager().getMonitor().isDragging();

            if (!this.dragging && isDragging) {
                this.dragging = true;
            } else if (this.dragging && !isDragging) {
                this.dragging = false;
                this.stopScrolling();
            }
        }

        attach() {
            this.attached = true;
            window.document.body.addEventListener('dragover', this.updateScrolling);
            window.document.body.addEventListener('touchmove', this.updateScrolling);
        }

        detach() {
            this.attached = false;
            window.document.body.removeEventListener('dragover', this.updateScrolling);
            window.document.body.removeEventListener('touchmove', this.updateScrolling);
        }

        // Update scaleX and scaleY every 100ms or so
        // and start scrolling if necessary
        updateScrolling = throttle(evt => {
            const {left: x, top: y, width: w, height: h} = this.container.getBoundingClientRect();
            const box = {x, y, w, h};
            const coords = getCoords(evt);

            // calculate strength
            this.scaleX = this.props.horizontalStrength(box, coords);
            this.scaleY = this.props.verticalStrength(box, coords);

            // start scrolling if we need to
            if (!this.frame && (this.scaleX || this.scaleY)) {
                this.startScrolling();
            }
        }, 100, {trailing: false})

        startScrolling() {
            let i = 0;
            const tick = () => {
                const {scaleX, scaleY, container} = this;
                const {strengthMultiplier, onScrollChange} = this.props;

                // stop scrolling if there's nothing to do
                if (strengthMultiplier === 0 || scaleX + scaleY === 0) {
                    this.stopScrolling();
                    return;
                }

                // there's a bug in safari where it seems like we can't get
                // mousemove events from a container that also emits a scroll
                // event that same frame. So we double the strengthMultiplier and only adjust
                // the scroll position at 30fps
                if (i++ % 2) {
                    const {
                        scrollLeft,
                        scrollTop,
                        scrollWidth,
                        scrollHeight,
                        clientWidth,
                        clientHeight
                    } = container;

                    const newLeft = scaleX ? container.scrollLeft = intBetween(
                            0,
                            scrollWidth - clientWidth,
                            scrollLeft + (scaleX * strengthMultiplier)
                        ) : scrollLeft;

                    const newTop = scaleY ? container.scrollTop = intBetween(
                            0,
                            scrollHeight - clientHeight,
                            scrollTop + (scaleY * strengthMultiplier)
                        ) : scrollTop;

                    onScrollChange(newLeft, newTop);
                }
                this.frame = raf(tick);
            };

            tick();
        }

        stopScrolling() {
            this.detach();
            this.scaleX = 0;
            this.scaleY = 0;

            if (this.frame) {
                raf.cancel(this.frame);
                this.frame = null;
            }
        }

        render() {
            const {
                // not passing down these props
                strengthMultiplier,
                verticalStrength,
                horizontalStrength,
                onScrollChange,
                dragDropManager,

                ...props
            } = this.props;

            return (
                <WrappedComponent
                    ref={ref => {
                        this.wrappedInstance = ref;
                    }}
                    {...props}
                />
            );
        }
    }

    if (useNewContextApi) {
        const DragDropMonitorWrapper = createDragDropMonitorWrapper(ScrollingComponent);
        return hoist(DragDropMonitorWrapper, WrappedComponent);
    }

    return hoist(ScrollingComponent, WrappedComponent);
}
