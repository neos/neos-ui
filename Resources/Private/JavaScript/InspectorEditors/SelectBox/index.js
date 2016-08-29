import React from 'react';
import {SelectBox} from 'Components';

const SelectBoxEditor = (props) => {
    const options = Object.keys(props.options.values).map(k => Object.assign({value: k}, props.options.values[k]))
    return (<SelectBox options={options} value={props.value} />);
};

export default SelectBoxEditor;
