import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {actions} from 'Host/Redux/';
import {Button} from 'Host/Components/';
import {immutableOperations} from 'Shared/Utilities/';
import style from './style.css';

const {$get} = immutableOperations;

@connect(state => ({
    isMenuHidden: $get(state, 'ui.offCanvas.isHidden')
}), {
    toggleOffCanvas: actions.UI.OffCanvas.toggle
})
export default class MenuToggler extends Component {
    static propTypes = {
        className: PropTypes.string,
        isMenuHidden: PropTypes.bool.isRequired,
        toggleOffCanvas: PropTypes.func.isRequired
    };

    render() {
        const {className, isMenuHidden} = this.props;
        const isMenuVisible = !isMenuHidden;
        const classNames = mergeClassNames({
            [style['menuToggler--isActive']]: isMenuVisible,
            [className]: className && className.length
        });

        return (
            <Button
                className={classNames}
                style="clean"
                hoverStyle="clean"
                isFocused={isMenuVisible}
                onClick={() => this.props.toggleOffCanvas()}
                id="neos__topBar__menuToggler"
                >
                <div className={style.menuToggler__icon}></div>
            </Button>
        );
    }
}
