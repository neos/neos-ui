import {themr} from 'react-css-themr';
import identifiers from './../identifiers.js';
import treeStyle from './tree.css';
import nodeStyle from './node.css';
import Tree from './tree.js';
import Node, {
    Header,
    Contents
} from './tree.js';

const themedTree = themr(identifiers.tree, treeStyle)(Tree);
themedTree.Node = themr(identifiers.treeNode, nodeStyle)(Node);
themedTree.Node.Header = themr(identifiers.treeNodeHeader, nodeStyle)(Header);
themedTree.Node.Contents = themr(identifiers.treeNodeContents, nodeStyle)(Contents);

export default themedTree;
