import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import I18n from '../I18n/';
import style from './style.css';

export default class Label extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        htmlFor: PropTypes.string.isRequired,
        labelPosition: PropTypes.oneOf(['before', 'after']),
        className: PropTypes.string,

        // Children related propTypes.
        isChildrenInlined: PropTypes.bool,
        children: PropTypes.node
    }

    render() {
        const {
            label,
            htmlFor,
            className,
            labelPosition
        } = this.props;
        const classNames = mergeClassNames({
            [style.label]: true,
            [className]: className && className.length
        });

        return (
            <label className={classNames} htmlFor={htmlFor}>
                {labelPosition === 'before' ? this.renderLabel() : this.renderChildren()}
                {this.renderLabelBreak()}
                {labelPosition === 'after' ? this.renderLabel() : this.renderChildren()}
            </label>
        );
    }

    renderLabel() {
        const {label} = this.props;

        return <I18n id={label} fallback={label} />;
    }

    renderLabelBreak() {
        const {isChildrenInlined, children} = this.props;

        return children && !isChildrenInlined ? <br /> : null;
    }

    renderChildren() {
        return this.props.children;
    }
}
Label.defaultProps = {
    labelPosition: 'before',
    isChildrenInlined: false
};
