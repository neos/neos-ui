import React, {PureComponent} from 'react';

import Logo from '@neos-project/react-ui-components/src/Logo/index';

import style from './style.css';

export default class Brand extends PureComponent {
    render() {
        return (
            <div className={style.wrapper}>
                <Logo />
            </div>
        );
    }
}
