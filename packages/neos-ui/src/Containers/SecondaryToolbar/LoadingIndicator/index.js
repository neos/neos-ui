import React, {PureComponent} from 'react';
import style from './style.css';

export default class LoadingIndicator extends PureComponent {
    render() {
        return (
            <div className={style.loadingIndicator__container}>
                <div className={style.loadingIndicator}>
                    <div className={style.loadingIndicator__bar}/>
                </div>
            </div>
        );
    }
}
