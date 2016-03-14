import h from 'virtual-dom/h';
import mergeClassNames from 'classnames';
import style from './style.css';
import {fontAwesome} from 'Shared/Utilities/index';

export default props => {
    props = Object.assign({
        icon: '',
        className: '',
        size: '',
        padded: '',
        spin: false
    }, props);
    const iconClassName = fontAwesome.getClassName(props.icon);

    return h('i', {
        className: mergeClassNames({
            [style.icon]: true,
            [iconClassName]: true,
            [props.className]: props.className && props.className.length,
            [style['icon--big']]: props.size === 'big',
            [style['icon--small']]: props.size === 'small',
            [style['icon--tiny']]: props.size === 'tiny',
            [style['icon--paddedLeft']]: props.padded === 'left',
            [style['icon--paddedRight']]: props.padded === 'right',
            [style['icon--spin']]: props.spin
        })
    });
};
