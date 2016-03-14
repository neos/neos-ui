import icon from 'Guest/Components/Icon/index';
import button from 'Guest/Components/Button/index';

import style from './style.css';

export default props => {
    props = Object.assign({
        style: 'transparent',
        hoverStyle: 'brand'
    }, props);

    return button(Object.assign({}, props, {
        className: `${props.className} ${style.iconButton}`
    }), icon({icon: props.icon}));
};
