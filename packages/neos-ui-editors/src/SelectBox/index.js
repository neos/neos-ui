import React, {PropTypes} from 'react';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';

const SelectBoxEditor = props => {
    const {commit} = props;
    const options = Object.keys(props.options.values)
        .map(k => Object.assign(
            {value: k},
            props.options.values[k]
        )
    );

    return <SelectBox options={options} value={props.value} onSelect={commit}/>;
};
SelectBoxEditor.propTypes = {
    commit: PropTypes.func.isRequired,
    value: PropTypes.any,
    options: PropTypes.any.isRequired
};

export default SelectBoxEditor;
