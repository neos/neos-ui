import React, {Component} from 'react';
import {Tree} from '../../../Components/';
import {connect} from 'react-redux';

const fixture = [{
    id: '0',
    name: 'My sitename',
    icon: 'globe',
    isActive: true,
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
                    name: 'Hotels',
                    icon: 'share-square-o'
                }, {
                    id: '0.1.1',
                    name: 'Angebote in Hannover',
                    icon: 'share-square-o'
                }, {
                    id: '0.1.2',
                    name: 'Angebote in Lübeck',
                    icon: 'share-square-o'
                }, {
                    id: '0.1.3',
                    name: 'Angebote in Münster',
                    icon: 'share-square-o'
                }, {
                    id: '0.1.4',
                    name: 'Angebote in Bayreuth',
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
                />
        );
    }

    onPageNodeToggle(node) {
        const newNode = Object.assign({}, node, {
            isCollapsed: !node.isCollapsed
        });

        // this.replaceNodeForIdPath(id, newNode);

        console.log('toggled', node, newNode);
    }

    onPageNodeClick(node) {
        console.log('page clicked', node);
    }
}
