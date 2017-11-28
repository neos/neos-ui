
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
//import SelectBoxOption from './selectBoxOption';
import style from './style.css';

export default class ComplexOption extends PureComponent {
    static propTypes = {
        option: PropTypes.object.isRequired,
        label: PropTypes.string.isRequired,
        imageUri: PropTypes.string,
        secondaryLabel: PropTypes.string,
        tertiaryLabel: PropTypes.string,
        icon: PropTypes.string
    };

    render() {
        const image = this.props.imageUri ? <img src={this.props.imageUri} alt={this.props.label} className={style.complexOption__image}/> : '';
        const secondaryLabel = this.props.secondaryLabel ?
            <span className={style.complexOption__secondaryLabel}>{this.props.secondaryLabel}</span> :
            '';
        const tertiaryLabel = this.props.tertiaryLabel ?
            <span className={style.complexOption__tertiaryLabel}>{this.props.tertiaryLabel}</span> :
            '';

        // TODO fixme
        return null;

        return (
            <SelectBoxOption {...this.props} icon={this.props.icon} className={style.complexOption__item}>
                {image}
                <span>{this.props.label}</span>
                {secondaryLabel}
                {tertiaryLabel}
            </SelectBoxOption>
        );
    }
}
