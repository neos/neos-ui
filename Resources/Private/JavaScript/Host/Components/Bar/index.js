import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';

export default class Bar extends Component {
    static propTypes = {
        position: PropTypes.string,
        children: PropTypes.node
    }

    render() {
        const {position} = this.props;
        const classNames = mergeClassNames({
            [style.bar]: true,
            [style.top]: position === 'top',
            [style.bottom]: position === 'bottom'
        });

        return (
            <div className={classNames}>
              {this.props.children}
            </div>
        );
    }
}
