import React, {PureComponent, PropTypes} from 'react';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';

class SelectBoxEditor extends PureComponent {
    static propTypes = {
        commit: PropTypes.func.isRequired,
        value: PropTypes.any,
        options: PropTypes.any.isRequired
    };

    constructor(props) {
        super(props);

        this.handleDelete = () => this.props.commit('');
    }

    render() {
        const {commit, value} = this.props;
        const options = Object.keys(this.props.options.values)
            .map(k => Object.assign(
                {value: k},
                this.props.options.values[k]
            )
        );
        const onDelete = value ? this.handleDelete : null;

        return <SelectBox options={options} value={value} onSelect={commit} onDelete={onDelete}/>;
    }
}

export default SelectBoxEditor;
