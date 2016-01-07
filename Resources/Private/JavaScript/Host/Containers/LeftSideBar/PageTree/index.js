import React, {Component} from 'react';
import {Tree} from 'Host/Components/';
import {connect} from 'react-redux';

const fixture = [{
    id: '0',
    name: 'My sitename',
    icon: 'globe',
    isActive: true,
    isFocused: true,
    children: [
        {
            id: '0.0',
            name: 'Dummy shortcut',
            icon: 'share-square-o'
        }, {
            id: '0.1',
            name: 'Page with children',
            icon: 'sitemap',
            isCollapsed: true,
            children: [
                {
                    id: '0.1.0',
                    name: 'Sub-Page',
                    icon: 'share-square-o'
                }, {
                    id: '0.1.1',
                    name: 'Another Sub-Page',
                    icon: 'share-square-o'
                }, {
                    id: '0.1.2',
                    name: 'Yet another Sub-Page',
                    icon: 'share-square-o'
                }, {
                    id: '0.1.3',
                    name: 'and here comes another one',
                    icon: 'share-square-o'
                }, {
                    id: '0.1.4',
                    name: 'well thats not exciting',
                    icon: 'share-square-o'
                }
            ]
        }, {
            name: 'Another dummy shortcut',
            icon: 'share-square-o'
        }, {
            name: 'yet dummy shortcut',
            icon: 'share-square-o'
        }, {
            name: 'Where is the real data?',
            icon: 'share-square-o'
        }, {
            name: 'This aint funny any more...',
            icon: 'share-square-o'
        }
    ]
}];

@connect()
export default class PageTree extends Component {
    render() {
        return (
            <Tree
                data={fixture}
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
        console.log('page focus changed', node);
    }
}
