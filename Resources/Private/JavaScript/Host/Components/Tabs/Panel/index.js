import React, {Component, PropTypes} from 'react';
import style from './style.css';

export default class Panel extends Component {
    static propTypes = {
        title: PropTypes.string,
        icon: PropTypes.string,
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element
        ]).isRequired
    }

    render() {
        return <div className={style.panel}>{this.props.children}</div>;
    }
}
Panel.displayName = 'Panel';
