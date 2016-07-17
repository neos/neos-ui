import React, {Component, PropTypes} from 'react';

import {DropDown, Icon} from 'Components/index';
import {SignalPropType} from 'Guest/Process/SignalRegistry/index';

import style from './style.css';

export default class ToolbarDropDown extends Component {
    static propTypes = {
        configuration: PropTypes.shape({
            placeholder: PropTypes.string.isRequired,
            items: PropTypes.arrayOf(
                PropTypes.shape({
                    icon: PropTypes.string.isRequired,
                    label: PropTypes.string.isRequired,
                    isActive: PropTypes.bool.isRequired,
                    isEnabled: PropTypes.bool.isRequired,
                    onSelect: SignalPropType.isRequired
                })
            ).isRequired
        }).isRequired,

        dispatchEditorSignal: PropTypes.func.isRequired
    };

    render() {
        const {dispatchEditorSignal} = this.props;
        const {items, placeholder} = this.props.configuration;

        return (
            <div className={style.wrapper}>
                <DropDown className={style.dropDown}>
                    <DropDown.Header className={style.dropDown__btn}>
                        {items.filter(
                            item => item.isActive
                        ).map(item =>
                            [
                                <Icon icon={item.icon} className={style.dropDown__itemIcon} key={item.label} />,
                                item.label
                            ]
                        )[0] || placeholder}
                    </DropDown.Header>
                    <DropDown.Contents className={style.dropDown__contents}>
                        {items.filter(
                            item => item.isEnabled
                        ).map(
                            item => (
                                <li className={style.dropDown__item} key={item.label}>
                                    <button type="button" onClick={() => dispatchEditorSignal(item.onSelect)}>
                                        <Icon icon={item.icon} className={style.dropDown__itemIcon} />
                                        {item.label}
                                    </button>
                                </li>
                            )
                        )}
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }
}
