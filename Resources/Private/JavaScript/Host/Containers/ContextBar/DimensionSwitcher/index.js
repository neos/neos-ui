import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {DropDown, Icon} from 'Host/Components/';
import style from './style.css';

@connect()
export default class DimensionSwitcher extends Component {
    static propTypes = {
        dimensions: PropTypes.array.isRequired
    };

    render() {
        const {dimensions} = this.props;

        return (
            <DropDown.Wrapper className={style.dropDown}>
                <DropDown.Header className={style.dropDown__btn}>
                    <Icon className={style.dropDown__btnIcon} icon="globe" />
                    ToDo: Current dimension name
                </DropDown.Header>
                <DropDown.Contents className={style.dropDown__contents}>
                    {dimensions.map((dimensionCategory, index) => this.renderDimensionCategory(dimensionCategory, index))}
                </DropDown.Contents>
            </DropDown.Wrapper>
        );
    }

    renderDimensionCategory(dimensionCategory, index) {
        return (
            <li key={index} className={style.dimensionCategory}>
                <Icon icon="globe" padded="right" className={style.dimensionCategory__icon} />
                {dimensionCategory.name}
                <br />

                ToDo: Render the select for all dimensions
            </li>
        );
    }
}
DimensionSwitcher.defaultProps = {
    dimensions: [{
        name: 'Language',
        items: [{
            name: 'Deutsch'
        }, {
            name: 'English'
        }]
    }]
};
