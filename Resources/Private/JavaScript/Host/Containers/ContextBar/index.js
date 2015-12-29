import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Icon, DropDown} from '../../Components/';
import style from './style.css';

@connect()
export default class ContextBar extends Component {
    render() {
        const dimensionClassNames = {
            wrapper: style.contextBar__dimensionDropDown,
            btn: style.contextBar__dimensionDropDown__btn,
            contents: style.contextBar__dimensionDropDown__contents
        };
        const dummyDimensions = [{
            name: 'Language',
            dimensions: [{
                name: 'Deutsch'
            }, {
                name: 'English'
            }]
        }];

        return (
            <div className={style.contextBar}>
                <DropDown iconBefore="globe" label="ToDo: Current dimension name" classNames={dimensionClassNames}>
                    {dummyDimensions.map(dimensionCategory => this.renderDimensionCategory(dimensionCategory))}
                </DropDown>

                <div className={style.contextBar__rightHandedActions}>
                    <a className={style.contextBar__rightHandedActions__btn} onClick={this.onClickOpenInNewTab.bind(this)}>
                        <Icon icon="external-link" />
                    </a>
                    <button className={style.contextBar__rightHandedActions__btn} onClick={this.onClickHideUi.bind(this)}>
                        <Icon icon="expand" />
                    </button>
                </div>
            </div>
        );
    }

    renderDimensionCategory(dimensionCategory) {
        return (
            <li className={style.dimensionCategory}>
                <Icon icon="globe" className={style.dimensionCategory__icon} />
                {dimensionCategory.name}
                <br />

                ToDo: Render the select for all dimensions
            </li>
        );
    }

    onClickOpenInNewTab(e) {
        e.preventDefault();

        console.log('open the current opened session into a new browser tab.');
    }

    onClickHideUi(e) {
        e.preventDefault();

        console.log('hide the whole ui yo.');
    }
}
