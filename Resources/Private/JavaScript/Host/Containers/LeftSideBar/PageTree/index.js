import React, {Component, PropTypes} from 'react';
import Immutable from 'immutable';
import {Tree} from 'Host/Components/';
import {immutableOperations} from 'Shared/Util';
import backend from 'Host/Service/Backend.js';
import {connect} from 'react-redux';

const {$get} = immutableOperations;

// const fixture = [{
//     id: '0',
//     name: 'My sitename',
//     icon: 'globe',
//     isActive: true,
//     isFocused: true,
//     children: [
//         {
//             id: '0.0',
//             name: 'Dummy shortcut',
//             icon: 'share-square-o'
//         }, {
//             id: '0.1',
//             name: 'Page with children',
//             icon: 'sitemap',
//             isCollapsed: true,
//             children: [
//                 {
//                     id: '0.1.0',
//                     name: 'Sub-Page',
//                     icon: 'share-square-o'
//                 }, {
//                     id: '0.1.1',
//                     name: 'Another Sub-Page',
//                     icon: 'share-square-o'
//                 }, {
//                     id: '0.1.2',
//                     name: 'Yet another Sub-Page',
//                     icon: 'share-square-o'
//                 }, {
//                     id: '0.1.3',
//                     name: 'and here comes another one',
//                     icon: 'share-square-o'
//                 }, {
//                     id: '0.1.4',
//                     name: 'well thats not exciting',
//                     icon: 'share-square-o'
//                 }
//             ]
//         }, {
//             name: 'Another dummy shortcut',
//             icon: 'share-square-o'
//         }, {
//             name: 'yet dummy shortcut',
//             icon: 'share-square-o'
//         }, {
//             name: 'Where is the real data?',
//             icon: 'share-square-o'
//         }, {
//             name: 'This aint funny any more...',
//             icon: 'share-square-o'
//         }
//     ]
// }];

@connect(state => {
    return {
        treeData: $get(state, 'ui.pageTree')
    };
})
export default class PageTree extends Component {

    static propTypes = {
        treeData: PropTypes.instanceOf(Immutable.Map)
    }

    render() {
        const {treeData} = this.props;

        return (
            <Tree
                data={treeData}
                onNodeToggle={this.onPageNodeToggle.bind(this)}
                onNodeClick={this.onPageNodeClick.bind(this)}
                onNodeFocusChanged={this.onPageNodeFocusChanged.bind(this)}
                />
        );
    }

    onPageNodeToggle(node) {
        const newNode = Object.assign({}, node, {
            isCollapsed: !node.isCollapsed
        });

        // this.replaceNodeForIdPath(id, newNode);

        console.log('page tree toggled', node, newNode);
    }

    onPageNodeClick(node) {
        console.log('page activated', node);
    }

    onPageNodeFocusChanged(node) {
        const {tabManager} = backend;
        const href = $get(node, 'href');

        tabManager.changeActiveTabSrc(href);
    }
}
