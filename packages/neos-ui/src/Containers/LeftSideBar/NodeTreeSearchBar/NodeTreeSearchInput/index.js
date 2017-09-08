import React from 'react';
import PropTypes from 'prop-types';
import {TextInput, IconButton} from '@neos-project/react-ui-components';

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
    return (
        <div>
            <TextInput
                placeholder={label}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                type="search"
                value={value}
                containerClassName={style.searchInput}
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
