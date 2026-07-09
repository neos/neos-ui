import React from 'react';
import PropTypes from 'prop-types';
import {TextInput, IconButton, Icon} from '@neos-project/react-ui-components';
import {translate} from '@neos-project/neos-ui-i18n';
import style from './style.module.css';

const NodeTypeFilter = ({onChange, onEnterKey, filterSearchTerm}) => {
    const handleResetFilter = () => {
        onChange('');
    };

    const handleValueChange = filterSearchTerm => {
        onChange(filterSearchTerm);
    };

    const handleEnterKey = () => {
        onEnterKey();
    };

    const label = translate('Neos.Neos.Ui:Main:filter', 'Filter');

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
    filterSearchTerm: PropTypes.string
};

export default NodeTypeFilter;
