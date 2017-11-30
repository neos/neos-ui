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
export default class ListPreviewElement extends PureComponent {
    static propTypes = {
        /*****************************
         * API inside custom ListPreviewElements
         *****************************/
        icon: PropTypes.string,        
        className: PropTypes.string,
        children: PropTypes.node.isRequired,
        
        /*****************************
         * API as needed by SelectBox
         *****************************/
        onClick: PropTypes.func.isRequired,
        isHighlighted: PropTypes.bool,
        onMouseEnter: PropTypes.func,

        /*****************************
         * Theme & Dependencies
         *****************************/
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'listPreviewElement': PropTypes.string.isRequired,
            'listPreviewElement--isHighlighted': PropTypes.string.isRequired,
            'listPreviewElement__icon': PropTypes.string.isRequired
        }).isRequired, /* eslint-enable quote-props */
        Icon: PropTypes.any.isRequired
    }

    render() {
        const {
            icon,
            className,
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
            [className]: className
        });

        return (
            <div
                onMouseEnter={onMouseEnter}
                onClick={onClick}
                className={optionClassName}
                >
                {Boolean(icon) && <Icon className={theme.listPreviewElement__icon} icon={icon}/>}
                {children}

            </div>
        );
    }
}
