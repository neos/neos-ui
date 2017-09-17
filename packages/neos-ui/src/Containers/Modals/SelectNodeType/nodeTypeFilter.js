import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TextInput from '@neos-project/react-ui-components/src/TextInput/';
import style from './style.css';

class NodeTypeFilter extends PureComponent {
    static propTypes = {
        onChange: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleValueChange = this.handleValueChange.bind(this);
    }

    render() {
        return (
            <div className={style.nodeTypeDialogHeader__filter}>
                <span className={style.nodeTypeFilter__label}>Filter:</span>
                <TextInput
                    onChange={this.handleValueChange}
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
