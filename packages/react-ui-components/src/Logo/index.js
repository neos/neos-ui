import React, {PureComponent} from 'react';

import logo from './logo.svg';
import style from './style.module.css';

export default class Logo extends PureComponent {
    render() {
        return (
            <div>
                <img className={style.logo} src={logo} alt="Neos" />
            </div>
        );
    }
}
