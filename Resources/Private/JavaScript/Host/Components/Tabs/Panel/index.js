import React, {Component, PropTypes} from 'react';
import style from './style.css';

export default class Panel extends Component {
    static propTypes = {
        // Props which are processed in the Parent Tabs Component.
        title: PropTypes.string,
        icon: PropTypes.string,

        // Contents of the Panel.
        children: PropTypes.node.isRequired
    }

    render() {
        return <div className={style.panel}>{this.props.children}</div>;
    }
}
Panel.displayName = 'Panel';
