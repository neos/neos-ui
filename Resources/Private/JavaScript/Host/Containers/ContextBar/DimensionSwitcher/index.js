import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {DropDown, Icon} from '../../../Components/';
import style from './style.css';

@connect()
export default class DimensionSwitcher extends Component {
    static propTypes = {
        dimensions: PropTypes.array.isRequired
    };

    render() {
        const {dimensions} = this.props;
        const dimensionClassNames = {
            wrapper: style.dropDown,
            btn: style.dropDown__btn,
            contents: style.dropDown__contents
        };

        return (
            <DropDown
                iconBefore="globe"
                label="ToDo: Current dimension name"
                classNames={dimensionClassNames}
                >
                {dimensions.map((dimensionCategory, index) => this.renderDimensionCategory(dimensionCategory, index))}
            </DropDown>
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
