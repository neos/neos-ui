import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {DropDown, Icon} from 'Host/Components/';
import style from './style.css';

const DimensionCategory = props => {
    const {data, key} = props;

    return (
        <li key={key} className={style.dimensionCategory}>
            <Icon icon="globe" padded="right" className={style.dimensionCategory__icon} />
            {data.name}
            <br />

            ToDo: Render the select for all dimension items
        </li>
    );
};
DimensionCategory.propTypes = {
    data: PropTypes.object.isRequired,
    key: PropTypes.number
};

@connect()
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
                    ToDo: Current dimension name
                </DropDown.Header>
                <DropDown.Contents className={style.dropDown__contents}>
                    {dimensions.map((dimensionCategory, index) => <DimensionCategory data={dimensionCategory} key={index} />)}
                </DropDown.Contents>
            </DropDown>
        );
    }
}
