import {themr} from '@friendsofreactjs/react-css-themr';
import identifiers from '../identifiers';
import treeStyle from './tree.css';
import nodeStyle from './node.css';
import Tree from './tree';
import Node, {
    Header,
    Contents
} from './node';

const ThemedTree = themr(identifiers.tree, treeStyle)(Tree);
const ThemedTreeNode = themr(identifiers.treeNode, nodeStyle)(Node);
const ThemedTreeNodeHeader = themr(identifiers.treeNodeHeader, nodeStyle)(Header);
const ThemedTreeNodeContents = themr(identifiers.treeNodeContents, nodeStyle)(Contents);

//
// Dependency injection
//
import injectProps from './../_lib/injectProps';
import Icon from './../Icon/index';

const FinalTreeComponent = injectProps({
    NodeComponent: ThemedTreeNode
})(ThemedTree);
FinalTreeComponent.Node = ThemedTreeNode;
FinalTreeComponent.Node.Header = injectProps({
    IconComponent: Icon
})(ThemedTreeNodeHeader);
FinalTreeComponent.Node.Contents = ThemedTreeNodeContents;

export default FinalTreeComponent;
