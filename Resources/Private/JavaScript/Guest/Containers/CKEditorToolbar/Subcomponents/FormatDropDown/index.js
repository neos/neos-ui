import React, {Component, PropTypes} from 'react';

import {Icon, DropDown} from 'Components/index';

import style from './style.css';

const dropDownItem = (icon, label, onSelect) => {
    return (<li className={style.dropDown__item}>
        <button type="submit" name="" value="logout" onClick={() => onSelect()}>
            <Icon icon={icon} className={style.dropDown__itemIcon} />
            {label}
        </button>
    </li>);
};

const createDropDownItem = (icon, label, styleDefinition) => (ckApi, editor) => {
    const Style = ckApi.style;
    const style = new Style(styleDefinition);
    const getIsActive = () => style.checkActive(editor.elementPath(), editor);
    const onSelect = () => {
        editor[getIsActive(editor) ? 'removeStyle' : 'applyStyle'](style);
        editor.fire('change');
    };

    return {
        component: dropDownItem(icon, label, onSelect),
        getIsEnabled: () => true,
        icon,
        label,
        getIsActive
    };
};

const dropDownItems = [
    createDropDownItem('paragraph', 'Paragraph', {element: 'p'}),
    createDropDownItem('header', 'Headline 1', {element: 'h1'}),
    createDropDownItem('header', 'Headline 2', {element: 'h2'}),
    createDropDownItem('header', 'Headline 3', {element: 'h3'}),
    createDropDownItem('header', 'Headline 4', {element: 'h4'}),
    createDropDownItem('header', 'Headline 5', {element: 'h5'}),
    createDropDownItem('header', 'Headline 6', {element: 'h6'}),
    createDropDownItem('font', 'Preformatted Text', {element: 'pre'})
];

export default class FormatDropDown extends Component {
    static propTypes = {
        ckApi: PropTypes.object.isRequired,
        editor: PropTypes.object.isRequired
    };

    componentWillMount() {
        const {ckApi, editor} = this.props;

        this.dropDownItems = dropDownItems.map(
            createItem => createItem(ckApi, editor)
        );
    }

    render() {
        return (
            <div className={style.wrapper}>
                <DropDown className={style.dropDown}>
                    <DropDown.Header className={style.dropDown__btn}>
                        {this.dropDownItems.filter(
                            item => item.getIsActive()
                        ).map(item =>
                            [
                                <Icon icon={item.icon} className={style.dropDown__itemIcon} />,
                                item.label
                            ]
                        )}
                    </DropDown.Header>
                    <DropDown.Contents className={style.dropDown__contents}>
                        {this.dropDownItems.filter(
                            item => item.getIsEnabled()
                        ).map(
                            item => item.component
                        )}
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }
}
