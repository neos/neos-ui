import React, {PureComponent} from 'react';
import {ResourceIcon} from '../ResourceIcon';

import logoSvg from './resource/logo.svg';
import style from './style.module.css';

export default class Logo extends PureComponent {
    render() {
        return <ResourceIcon source={logoSvg} className={style.logo}></ResourceIcon>;
    }
}
