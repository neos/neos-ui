import React, {PropTypes} from 'react';
import TextInput from '@neos-project/react-ui-components/lib/TextInput/';
import unescape from 'lodash.unescape';

const TextField = props => {
    const {value, commit, validationErrors, options, translate, highlight} = props;
    // Placeholder text must be unescaped in case html entities were used
    const placeholder = options && options.placeholder && translate(unescape(options.placeholder));
    return (<TextInput
        autoFocus={options && options.autoFocus}
        value={value}
        onChange={commit}
        validationErrors={validationErrors}
        placeholder={placeholder}
        highlight={highlight}
        />);
};
TextField.propTypes = {
    value: PropTypes.string,
    commit: PropTypes.func.isRequired,
    validationErrors: PropTypes.array,
    highlight: PropTypes.bool,
    translate: PropTypes.func.isRequired,
    options: PropTypes.object
};

export default TextField;
