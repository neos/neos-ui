import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextInput from '@neos-project/react-ui-components/src/TextInput/';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import {neos} from '@neos-project/neos-ui-decorators';
import style from './style.css';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
class NodeTypeFilter extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleValueChange = this.handleValueChange.bind(this);
    }

    render() {
        const {i18nRegistry} = this.props;
        const label = i18nRegistry.translate('filter', 'Filter', {}, 'Neos.Neos', 'Main');

        return (
            <div className={style.nodeTypeDialogHeader__filter}>
                <Icon icon="filter" padded="right"/>
                <TextInput
                    onChange={this.handleValueChange}
                    placeholder={label}
                    />
            </div>
        );
    }

    handleValueChange(filterSearchTerm) {
        const {onChange} = this.props;
        onChange(filterSearchTerm);
    }
}

export default NodeTypeFilter;
