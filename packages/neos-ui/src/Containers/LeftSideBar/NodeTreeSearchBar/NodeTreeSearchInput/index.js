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
    const wrapperClassName = mergeClassNames({
        [style.wrapper]: true,
        [style['wrapper--focused']]: focused
    });
    const searchIconClassName = mergeClassNames({
        [style.placeholderIcon]: true,
        [style.clearButton]: true
    });
    return (
        <div className={wrapperClassName} id="neos-NodeTreeSearchInput">
            <Icon
                icon="search"
                className={searchIconClassName}
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
                    className={style.clearButton}
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
