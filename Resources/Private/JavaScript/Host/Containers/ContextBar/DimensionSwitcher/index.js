import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {DropDown, Icon, Select} from 'Host/Components/';
import {$transform, $get} from 'plow-js';
import style from './style.css';

const DimensionCategory = props => {
    const {data, key} = props;

    return (
        <li key={key} className={style.dimensionCategory}>
            <Icon icon="globe" padded="right" className={style.dimensionCategory__icon} />
            <br />

            <Select
                name="form-field-name"
                value="intl"
                options={data.presets}
                />

        </li>
    );
};
DimensionCategory.propTypes = {
    data: PropTypes.object.isRequired,
    key: PropTypes.number
};

@connect($transform({
    dimensions: $get('cr.dimensions')
}))
export default class DimensionSwitcher extends Component {
    static propTypes = {
        dimensions: PropTypes.array.isRequired
    };

    static defaultProps = {
        dimensions: []
    };

    render() {
        const {dimensions} = this.props;

        return (
            <DropDown className={style.dropDown}>
                <DropDown.Header className={style.dropDown__btn}>
                    <Icon className={style.dropDown__btnIcon} icon="globe" />
                    ToDo: Current dimension name {dimensions.myvar}
                </DropDown.Header>
                <DropDown.Contents className={style.dropDown__contents}>
                    {dimensions.map((dimension, index) => <DimensionCategory data={dimension} key={index} />)}
                </DropDown.Contents>
            </DropDown>
        );
    }
}
