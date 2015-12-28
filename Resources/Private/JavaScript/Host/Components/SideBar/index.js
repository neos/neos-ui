import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';

export default class SideBar extends Component {
    static propTypes = {
        position: PropTypes.oneOf(['left', 'right']).isRequired,
        className: PropTypes.string,
        children: PropTypes.node
    }

    render() {
        const {position, className} = this.props;
        const classNames = mergeClassNames({
            [className]: true,
            [style.sideBar]: true,
            [style.left]: position === 'left',
            [style.right]: position === 'right'
        });

        return (
            <div className={classNames}>
              {this.props.children}
            </div>
        );
    }
}
