import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

import style from './style.css';

export default class SearchInput extends PureComponent {
    static defaultProps = {
        value: ''
    };

    static propTypes = {
        value: PropTypes.string.isRequired,
        label: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        onFocusChange: PropTypes.func,
        theme: PropTypes.object.isRequired,
        IconComponent: PropTypes.any.isRequired,
        TextInputComponent: PropTypes.any.isRequired
    }

    state = {hasFocus: false};

    handleFocus = () => {
        const {onFocusChange} = this.props;
        this.setState({hasFocus: true});
        if (onFocusChange) {
            onFocusChange(true);
        }
    }

    handleBlur = () => {
        const {onFocusChange} = this.props;
        this.setState({hasFocus: false});
        if (onFocusChange) {
            onFocusChange(false);
        }
    }

    render() {
        const {
            value,
            label,
            onChange,
            IconComponent,
            TextInputComponent
        } = this.props;
        const showClear = value.length > 0;
        const focused = this.state.hasFocus;
        const inputClassName = mergeClassNames({
            [style.searchInput]: true,
            [style['searchInput--focused']]: focused
        });
        return (
            <div className={style.wrapper}>
                <IconComponent
                    icon="search"
                    className={focused ? style.hidden : style.placeholderIcon}
                    theme={{iconButton: focused ? style['clearButton--focused'] : style.clearButton}}
                    />
                <TextInputComponent
                    placeholder={label}
                    onChange={onChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    type="search"
                    value={value}
                    containerClassName={inputClassName}
                    />
            </div>
        );
    }
}
