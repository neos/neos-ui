import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '@neos-project/react-ui-components/src/TextInput/';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import {neos} from '@neos-project/neos-ui-decorators';
import style from './style.css';

const NodeTypeFilter = ({onChange, filterSearchTerm, i18nRegistry}) => {
    const handleResetFilter = () => {
        onChange('');
    };

    const handleValueChange = filterSearchTerm => {
        onChange(filterSearchTerm);
    };

    const label = i18nRegistry.translate('filter', 'Filter', {}, 'Neos.Neos', 'Main');

    return (
        <div className={style.nodeTypeDialogHeader__filter}>
            {filterSearchTerm ? (
                <IconButton icon="times" onClick={handleResetFilter}/>
            ) : (
                <Icon icon="filter" padded="right"/>
            ) }

            <TextInput
                value={filterSearchTerm}
                onChange={handleValueChange}
                placeholder={label}
                />
        </div>
    );
};

NodeTypeFilter.propTypes = {
    onChange: PropTypes.func.isRequired,
    filterSearchTerm: PropTypes.string,
    i18nRegistry: PropTypes.object.isRequired
};

export default neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))(NodeTypeFilter);
