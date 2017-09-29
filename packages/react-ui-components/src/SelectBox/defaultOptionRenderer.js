import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

export default class DefaultOptionRenderer extends PureComponent {

        static propTypes = {
            /**
             * This prop represents a set of options.
             * Each option must have a value and can have a label and an icon.
             */
            option: PropTypes.shape({
                icon: PropTypes.string,
                // "value" is not part of PropTypes validation, as the "value field" is specified via the "optionValueField" property
                label: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.object
                ]).isRequired
            }),

            onClick: PropTypes.func.isRequired,

            /**
             * An optional css theme to be injected.
             */
            theme: PropTypes.shape({/* eslint-disable quote-props */
                'wrapper': PropTypes.string,
                'selectedOptions': PropTypes.string,
                'selectedOptions__item': PropTypes.string
            }).isRequired, /* eslint-enable quote-props */

            //
            // Static component dependencies which are injected from the outside (index.js)
            // Used in sub-components
            //
            IconComponent: PropTypes.any.isRequired
        }

        render() {
            const {
                option,
                onClick,
                theme,
                IconComponent
            } = this.props;
            const {icon, label} = option;
            const optionClassName = mergeClassNames({
                [theme.selectBox__item]: true,
                [theme['selectBox__item--isSelectable']]: true
            });

            return (
                <li
                    onClick={onClick}
                    className={optionClassName}
                    >
                    {
                        icon ?
                            <IconComponent className={theme.selectBox__itemIcon} icon={icon}/> :
                            null
                    }
                    <span>{ label }</span>
                </li>
            );
        }

    }
