import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import Bar from '@neos-project/react-ui-components/src/Bar/';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.css';

@neos(globalRegistry => ({
    containerRegistry: globalRegistry.get('containers')
}))
@connect($transform({
    isHidden: $get('ui.fullScreen.isFullScreen')
}))
export default class PrimaryToolbar extends PureComponent {
    static propTypes = {
        containerRegistry: PropTypes.object.isRequired,

        isHidden: PropTypes.bool.isRequired
    };

    render() {
        const {isHidden, containerRegistry} = this.props;

        const MenuToggler = containerRegistry.get('PrimaryToolbar/MenuToggler');
        const LeftSideBarToggler = containerRegistry.get('PrimaryToolbar/LeftSideBarToggler');
        const EditModePanelToggler = containerRegistry.get('PrimaryToolbar/EditModePanelToggler');
        const UserDropDown = containerRegistry.get('PrimaryToolbar/UserDropDown');
        const PublishDropDown = containerRegistry.get('PrimaryToolbar/PublishDropDown');

        const classNames = mergeClassNames({
            [style.primaryToolbar]: true,
            [style['primaryToolbar--isHidden']]: isHidden
        });
        return (
            <Bar position="top" className={classNames}>
                <MenuToggler className={style.primaryToolbar__btn}/>
                <LeftSideBarToggler className={style.primaryToolbar__btn}/>
                <EditModePanelToggler className={style.primaryToolbar__btn}/>

                <div className={style.primaryToolbar__rightSidedActions}>
                    <UserDropDown/>
                    <PublishDropDown/>
                </div>
            </Bar>
        );
    }
}
