import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import treeStyle from './tree.css';
import nodeStyle from './node.css';
import dragLayerStyle from './dragLayer.css';
import Tree from './tree';
import Node, {
    Header,
    Contents
} from './node';
import DragLayer from './dragLayer';

const ThemedTree = themr(identifiers.tree, treeStyle)(Tree);
const ThemedTreeNode = themr(identifiers.treeNode, nodeStyle)(Node);
const ThemedTreeNodeHeader = themr(identifiers.treeNodeHeader, nodeStyle)(Header);
const ThemedTreeNodeContents = themr(identifiers.treeNodeContents, nodeStyle)(Contents);
const ThemedTreeDragLayer = themr(identifiers.treeDragLayer, dragLayerStyle)(DragLayer);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps';
import Icon from './../Icon';

const FinalTreeComponent = injectProps({
    NodeComponent: ThemedTreeNode
})(ThemedTree);
FinalTreeComponent.Node = ThemedTreeNode;
FinalTreeComponent.Node.Header = injectProps({
    IconComponent: Icon
})(ThemedTreeNodeHeader);
FinalTreeComponent.Node.Contents = ThemedTreeNodeContents;
FinalTreeComponent.DragLayer = ThemedTreeDragLayer;

export default FinalTreeComponent;
