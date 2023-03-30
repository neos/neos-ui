import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

/**
 * The ListPreviewElement is responsible for rendering a single element in a Select Box
 * or a MultiSelectBox.
 *
 * It encapsulates basic styling and functionality needed by the SelectBox / MultiSelectBox.
 *
 * **Instead of directly using this component, you might want to use SelectBox_Option_SingleLine
 * or SelectBox_Option_MultiLineWithThumbnail instead, as these provide default styling.**
 *
 * Often, you will create your own ListPreviewElements, taking this element as a basis like the following:
 * ```
 * const MySpecialPreviewElement = props => {
 *      return (
 *          <ListPreviewElement {...props} icon={props.yourIconHere}>
 *               ... your content here ...
 *          </ListPreviewElement>
 *      );
 * }
 * ```
 */
class ListPreviewElement extends PureComponent {
    static propTypes = {
        // ------------------------------
        // API inside custom ListPreviewElements
        // ------------------------------
        icon: PropTypes.string,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        children: PropTypes.node.isRequired,

        // ------------------------------
        // API as needed by SelectBox
        // ------------------------------
        onClick: PropTypes.func,
        isHighlighted: PropTypes.bool,
        onMouseEnter: PropTypes.func,

        // ------------------------------
        // Theme & Dependencies
        // ------------------------------
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'listPreviewElement': PropTypes.string.isRequired,
            'listPreviewElement--isHighlighted': PropTypes.string.isRequired,
            'listPreviewElement--isDisabled': PropTypes.string.isRequired,
            'listPreviewElement__icon': PropTypes.string.isRequired
        }).isRequired, /* eslint-enable quote-props */
        Icon: PropTypes.any.isRequired
    }

    render() {
        const {
            icon,
            className,
            disabled,
            children,

            onClick,
            isHighlighted,
            onMouseEnter,

            theme,
            Icon
        } = this.props;

        const optionClassName = mergeClassNames({
            [theme.listPreviewElement]: true,
            [theme['listPreviewElement--isHighlighted']]: isHighlighted,
            [theme['listPreviewElement--isDisabled']]: disabled,
            [className]: className
        });

        const noop = () => {};

        return (
            <div
                onMouseEnter={disabled ? noop : onMouseEnter}
                onClick={disabled ? noop : onClick}
                className={optionClassName}
                role="button"
                >
                {Boolean(icon) && <div className={theme.listPreviewElement__iconWrapper}><Icon className={theme.listPreviewElement__icon} icon={icon}/></div>}
                {children}

            </div>
        );
    }
}

export default ListPreviewElement;
