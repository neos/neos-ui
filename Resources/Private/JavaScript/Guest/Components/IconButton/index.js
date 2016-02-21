import icon from 'Guest/Components/Icon/';
import button from 'Guest/Components/Button/';

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
