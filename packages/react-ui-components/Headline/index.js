import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';

const types = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6'
];

const Headline = props => {
    const {
        type,
        className,
        children
    } = props;
    const headingStyle = props.style || type;
    const classNames = mergeClassNames({
        [style.heading]: true,
        [style[`heading--${headingStyle}`]]: true,
        [className]: className && className.length
    });
    let heading;

    switch (type) {
        case 'h1':
            heading = <h1 className={classNames}>{children}</h1>;
            break;

        case 'h2':
            heading = <h2 className={classNames}>{children}</h2>;
            break;

        case 'h3':
            heading = <h3 className={classNames}>{children}</h3>;
            break;

        case 'h4':
            heading = <h4 className={classNames}>{children}</h4>;
            break;

        case 'h5':
            heading = <h5 className={classNames}>{children}</h5>;
            break;

        default:
            heading = <h6 className={classNames}>{children}</h6>;
            break;
    }

    return heading;
};
Headline.propTypes = {
    // Contents of the Headline.
    children: PropTypes.node.isRequired,

    // The semantic tag type of the headline.
    type: PropTypes.oneOf(types).isRequired,

    // Optional style identifier,
    // this enables the possibility to diff the semantic value of the UI to the displayed style.
    style: PropTypes.oneOf(types),
    className: PropTypes.string
};
Headline.defaultProps = {
    type: 'h1'
};

export default Headline;
