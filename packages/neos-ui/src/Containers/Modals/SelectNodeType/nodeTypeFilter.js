import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '@neos-project/react-ui-components/src/TextInput/';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import {neos} from '@neos-project/neos-ui-decorators';
import style from './style.css';

const NodeTypeFilter = ({onChange, onEnterKey, filterSearchTerm, i18nRegistry}) => {
    const handleResetFilter = () => {
        onChange('');
    };

    const handleValueChange = filterSearchTerm => {
        onChange(filterSearchTerm);
    };

    const handleEnterKey = () => {
        onEnterKey();
    };

    const label = i18nRegistry.translate('filter', 'Filter', {}, 'Neos.Neos', 'Main');

    return (
        <div className={style.nodeTypeDialogHeader__filter}>
            <div className={style.nodeTypeDialogHeader__filterIconSearch}>
                <Icon icon="search" size="1x"/>
            </div>

            {filterSearchTerm && (
                <div className={style.nodeTypeDialogHeader__filterIconReset}>
                    <IconButton icon="times" style="brand" onClick={handleResetFilter}/>
                </div>
            )}

            <TextInput
                className={style.nodeTypeDialogHeader__filterInput}
                containerClassName={style.nodeTypeDialogHeader__filterInputContainer}
                value={filterSearchTerm}
                onChange={handleValueChange}
                onEnterKey={handleEnterKey}
                setFocus={true}
                placeholder={label}
                />
        </div>
    );
};

NodeTypeFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    onEnterKey: PropTypes.func.isRequired,
    filterSearchTerm: PropTypes.string,
    i18nRegistry: PropTypes.object.isRequired
};

export default neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))(NodeTypeFilter);
