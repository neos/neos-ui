
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import SelectBoxOption from './selectBoxOption';
import style from './style.css';

export default class ComplexOption extends PureComponent {
    static propTypes = {
        option: PropTypes.object.required,
        label: PropTypes.string.required,
        imageUri: PropTypes.string,
        secondaryLabel: PropTypes.string,
        tertiaryLabel: PropTypes.string,
        icon: PropTypes.string
    };

    render() {
        const option = this.props.option;

        const image = this.props.imageUri ? <img src={this.props.imageUri} className={style.complexOption__image} /> : '';
        const secondaryLabel = this.props.secondaryLabel ?
            <span className={style.complexOption__secondaryLabel}>{this.props.secondaryLabel}</span> :
            '';
        const tertiaryLabel = this.props.tertiaryLabel ?
            <span className={style.complexOption__tertiaryLabel}>{this.props.tertiaryLabel}</span> :
            '';

        return (
            <SelectBoxOption {...this.props} icon={this.props.icon} className={style.complexOption__item}>
                {image}
                <span>{option.label}</span>
                {secondaryLabel}
                {tertiaryLabel}
            </SelectBoxOption>
        );
    }
}
