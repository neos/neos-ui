import React from 'react';
import PropTypes from 'prop-types';
import {TextInput, Icon, IconButton} from '@neos-project/react-ui-components';
import mergeClassNames from 'classnames';

import style from './style.css';

const NodeTreeSearchInput = ({
        value,
        label,
        onChange,
        onFocus,
        onBlur,
        onClearClick,
        focused
    }) => {
    const showClear = value.length > 0;
    const inputClassName = mergeClassNames({
        [style.searchInput]: true,
        [style['searchInput--focused']]: focused
    });
    return (
        <div className={style.wrapper}>
            <Icon
                icon="search"
                className={focused ? style.hidden : style.placeholderIcon}
                theme={{iconButton: focused ? style['clearButton--focused'] : style.clearButton}}
                onClick={onClearClick}
                />
            <TextInput
                placeholder={label}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                type="search"
                value={value}
                containerClassName={inputClassName}
                />
            {showClear && (
                <IconButton
                    icon="times"
                    theme={{iconButton: focused ? style['clearButton--focused'] : style.clearButton}}
                    onClick={onClearClick}
                    />
            )}
        </div>
    );
};

NodeTreeSearchInput.propTypes = {
    value: PropTypes.any,
    label: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onClearClick: PropTypes.func,
    focused: PropTypes.bool
};

export default NodeTreeSearchInput;
