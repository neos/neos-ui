import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
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

        const PrimaryToolbalLeft = containerRegistry.getChildren('PrimaryToolbar/Left');
        const PrimaryToolbalRight = containerRegistry.getChildren('PrimaryToolbar/Right');

        const classNames = mergeClassNames({
            [style.primaryToolbar]: true,
            [style['primaryToolbar--isHidden']]: isHidden
        });
        return (
            <Bar position="top" className={classNames}>
                {PrimaryToolbalLeft.map((Item, key) => <Item className={style.primaryToolbar__btn} key={key}/>)}

                <div className={style.primaryToolbar__rightSidedActions}>
                    {PrimaryToolbalRight.map((Item, key) => <Item key={key}/>)}
                </div>
            </Bar>
        );
    }
}
