import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Icon, DropDown, Button} from '../../Components/';
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
                    {dummyDimensions.map((dimensionCategory, index) => this.renderDimensionCategory(dimensionCategory, index))}
                </DropDown>

                <div className={style.contextBar__rightHandedActions}>
                    <Button className={style.contextBar__rightHandedActions__btn} style="clean" hoverStyle="brand" onClick={this.onClickOpenInNewTab.bind(this)}>
                      <Icon icon="external-link" />
                    </Button>
                    <Button className={style.contextBar__rightHandedActions__btn} style="clean" hoverStyle="brand" onClick={this.onClickHideUi.bind(this)}>
                      <Icon icon="expand" />
                    </Button>
                </div>
            </div>
        );
    }

    renderDimensionCategory(dimensionCategory, index) {
        return (
            <li key={index} className={style.dimensionCategory}>
                <Icon icon="globe" className={style.dimensionCategory__icon} />
                {dimensionCategory.name}
                <br />

                ToDo: Render the select for all dimensions
            </li>
        );
    }

    onClickOpenInNewTab() {
        console.log('open the current opened session into a new browser tab.');
    }

    onClickHideUi() {
        console.log('hide the whole ui yo.');
    }
}
