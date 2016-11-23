import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get, $or} from 'plow-js';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';

const {isDocumentNodeSelectedSelector} = selectors.CR.Nodes;

import style from './style.css';

@connect($transform({
    isFringedLeft: $get('ui.leftSideBar.isHidden'),
    isFringedRight: $get('ui.rightSideBar.isHidden'),
    isHidden: $or(
        $get('ui.editModePanel.isHidden'),
        $get('ui.fullScreen.isFullScreen')
    )
}), {
    //toggleFullScreen: actions.UI.FullScreen.toggle
})
export default class EditModePanel extends Component {
    static propTypes = {
        isFringedLeft: PropTypes.bool.isRequired,
        isFringedRight: PropTypes.bool.isRequired,
        isHidden: PropTypes.bool.isRequired
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {
            isFringedLeft,
            isFringedRight,
            isHidden
        } = this.props;
        const classNames = mergeClassNames({
            [style.editModePanel]: true,
            [style['editModePanel--isFringeLeft']]: isFringedLeft,
            [style['editModePanel--isFringeRight']]: isFringedRight,
            [style['editModePanel--isHidden']]: isHidden
        });
        // const previewButtonClassNames = mergeClassNames({
        //     [style.secondaryToolbar__buttonLink]: true,
        //     [style['secondaryToolbar__buttonLink--isDisabled']]: !previewUrl
        // });

        return (
            <div className={classNames}>
                <div className="editModePanel__editingModes">
                    <p>Editing Modes</p>
                    <button>foo</button>
                </div>
                <div className="editModePanel__previewCentral">
                    <p>Preview Central</p>
                    <button>foo</button>
                </div>
                
            </div>
        );
    }
}
