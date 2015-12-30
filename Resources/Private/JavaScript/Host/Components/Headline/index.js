import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import I18n from '../I18n/';
import style from './style.css';

const types = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6'
];

export default class Headline extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        type: PropTypes.oneOf(types).isRequired,
        style: PropTypes.oneOf(types),
        className: PropTypes.string
    }

    render() {
        const {
            type,
            className
        } = this.props;
        const headingStyle = this.props.style || type;
        const classNames = mergeClassNames({
            [style.heading]: true,
            [style[`heading--${headingStyle}`]]: true,
            [className]: className && className.length
        });
        const title = <I18n target={this.props.title} />;
        let heading;

        switch (type) {
            case 'h1':
                heading = <h1 className={classNames}>{title}</h1>;
                break;

            case 'h2':
                heading = <h2 className={classNames}>{title}</h2>;
                break;

            case 'h3':
                heading = <h3 className={classNames}>{title}</h3>;
                break;

            case 'h4':
                heading = <h4 className={classNames}>{title}</h4>;
                break;

            case 'h5':
                heading = <h5 className={classNames}>{title}</h5>;
                break;

            default:
                heading = <h6 className={classNames}>{title}</h6>;
                break;
        }

        return (<div>{heading}</div>);
    }
}
Headline.defaultProps = {
    type: 'h1'
};
