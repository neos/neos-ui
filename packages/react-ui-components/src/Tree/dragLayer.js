import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {useDragLayer} from 'react-dnd';

const _NodeDragPreview = ({nodeDndType, ChildRenderer, currentlyDraggedNodes, theme = {}}) => {
    return (
        <div className={theme.dragWrapper} >
            {currentlyDraggedNodes.length > 1 && <div className={theme.count}>{currentlyDraggedNodes.length}</div>}
            {currentlyDraggedNodes.map((node, index) => <div key={node.contextPath} className={theme.node} style={{
                top: index * 15,
                left: index * 5
            }}>
                <ChildRenderer
                    ChildRenderer={() => null}
                    nodeDndType={nodeDndType}
                    node={node}
                    level={1}
                    currentlyDraggedNodes={[]}
                />
            </div>)}
        </div>
    );
};

_NodeDragPreview.propTypes = {
    nodeDndType: PropTypes.string.isRequired,
    ChildRenderer: PropTypes.elementType.isRequired,
    currentlyDraggedNodes: PropTypes.array.isRequired,
    theme: PropTypes.object
};

const NodeDragPreview = memo(_NodeDragPreview);

const getItemStyles = currentOffset => {
    if (!currentOffset) {
        return {
            display: 'none'
        };
    }
    const {x, y} = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform
    };
};

const DragLayer = props => {
    const {
        itemType,
        isDragging,
        currentOffset
    } = useDragLayer(monitor => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getClientOffset(),
        isDragging: monitor.isDragging()
    }));
    function renderItem() {
        switch (itemType) {
            case props.nodeDndType:
                return <NodeDragPreview {...props} />;
            default:
                return null;
        }
    }
    if (!isDragging) {
        return null;
    }
    return (
        <div className={props.theme.layer}>
            <div
                style={getItemStyles(currentOffset)}
            >
                {renderItem()}
            </div>
        </div>
    );
};

export default DragLayer;
