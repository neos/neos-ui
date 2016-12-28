import React, {PureComponent, PropTypes} from 'react';
import I18n from '@neos-project/neos-ui-i18n';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';

class SelectBoxEditor extends PureComponent {
    static propTypes = {
        commit: PropTypes.func.isRequired,
        value: PropTypes.any,
        options: PropTypes.any.isRequired,
        translate: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleDelete = () => this.props.commit('');
    }

    render() {
        const {commit, value, options, translate} = this.props;
        const selectBoxOptions = Object.keys(this.props.options.values)
            // Filter out items without a label
            .map(k => options.values[k].label && Object.assign(
                {value: k},
                options.values[k],
                {label: <I18n id={options.values[k].label}/>}
            )
        ).filter(k => k);
        // Placeholder text must be unescaped in case html entities were used
        const placeholder = options && options.placeholder && translate(unescape(options.placeholder));
        const onDelete = value ? this.handleDelete : null;

        return (<SelectBox
            options={selectBoxOptions}
            value={value}
            onSelect={commit}
            onDelete={onDelete}
            placeholder={placeholder}
            />);
    }
}

export default SelectBoxEditor;
