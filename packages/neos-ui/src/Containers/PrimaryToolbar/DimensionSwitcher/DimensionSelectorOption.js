import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import style from './style.module.css';
import SelectBox_Option_SingleLineLink from '@neos-project/react-ui-components/src/SelectBox_Option_SingleLineLink/index';
import SelectBox_Option_SingleLine from '@neos-project/react-ui-components/src/SelectBox_Option_SingleLine/index';
import mergeClassNames from 'classnames';

export default class DimensionSelectorOption extends PureComponent {
    static propTypes = {
        option: PropTypes.shape({
            label: PropTypes.string.isRequired,
            disallowed: PropTypes.bool,
            existing: PropTypes.bool,
            url: PropTypes.string
        })
    };

    render() {
        const {option} = this.props;

        const className = mergeClassNames({
            [style.lighter]: !option.existing,
            [style.strikethrough]: option.disallowed
        });

        if (option.existing) {
            const linkOptions = {
                className: style.whiteLink,
                href: option.url,
                target: '_blank',
                rel: 'noopener noreferrer',
                onClick: (event) => event.preventDefault()
            }

            return (
                <SelectBox_Option_SingleLineLink
                    {...this.props}
                    className={className}
                    label={option.label}
                    linkOptions={linkOptions}
                />
            );
        }

        return (
            <SelectBox_Option_SingleLine
                {...this.props}
                className={className}
                label={option.label}
            />
        );
    }
}
