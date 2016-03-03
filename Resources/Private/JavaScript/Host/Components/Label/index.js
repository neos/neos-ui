import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import I18n from 'Host/Components/I18n/';
import style from './style.css';

const renderLabel = label => <I18n id={label} fallback={label} />;
const renderLabelBreak = (isChildrenInlined, children) => children && !isChildrenInlined ? <br /> : null;

const Label = props => {
    const {
        label,
        children,
        className,
        labelPosition,
        isChildrenInlined,
        ...directProps
    } = props;
    const classNames = mergeClassNames({
        [style.label]: true,
        [className]: className && className.length
    });

    return (
        <label className={classNames} {...directProps}>
            {labelPosition === 'before' ? renderLabel(label) : children}
            {renderLabelBreak(isChildrenInlined, children)}
            {labelPosition === 'after' ? renderLabel(label) : children}
        </label>
    );
};
Label.propTypes = {
    label: PropTypes.string.isRequired,
    labelPosition: PropTypes.oneOf(['before', 'after']),
    className: PropTypes.string,

    // Children related propTypes.
    isChildrenInlined: PropTypes.bool,
    children: PropTypes.node
};
Label.defaultProps = {
    labelPosition: 'before',
    isChildrenInlined: false
};

export default Label;
