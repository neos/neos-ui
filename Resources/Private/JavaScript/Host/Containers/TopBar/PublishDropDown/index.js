import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import Immutable from 'immutable';
import {I18n, Icon, DropDown} from '../../../Components/';
import style from './style.css';

@connect(state => {
    return {
        changes: state.get('changes')
    };
})
export default class PublishDropDown extends Component {
    static propTypes = {
        changes: PropTypes.instanceOf(Immutable.List)
    }

    render() {
        const {changes} = this.props;
        const isPublishable = changes.count() > 0;
        const publishBtnClassName = mergeClassNames({
            [style.btn]: true,
            [style['btn--publishBtn']]: true,
            [style['btn--disabled']]: !isPublishable,
            [style['btn--notAllowed']]: !isPublishable,
            [style['btn--isSaving']]: false
        });
        const dropDownClassNames = {
            wrapper: style.dropDown,
            btn: mergeClassNames({
                [style.btn]: true,
                [style.dropDown__btn]: true,
                [style['btn--disabled']]: !isPublishable
            }),
            ['btn--active']: style['dropDown__btn--active'],
            contents: style.dropDown__contents
        };
        const publishRelatedItemClassName = mergeClassNames({
            [style.dropDown__contents__item]: true,
            [style['dropDown__contents__item--disabled']]: !isPublishable
        });
        const publishRelatedItemAttributes = {};

        if (!isPublishable) {
            publishRelatedItemAttributes.disabled = 'disabled';
        }

        return (
            <div className={style.wrapper}>
                <button className={publishBtnClassName} onClick={this.onPublishClick.bind(this)} {...publishRelatedItemAttributes}>
                    <I18n target="Published" />
                </button>
                <DropDown classNames={dropDownClassNames}>
                    <li className={publishRelatedItemClassName}>
                        <button onClick={this.onPublishAllClick.bind(this)} {...publishRelatedItemAttributes}>
                            <Icon icon="upload" />
                            <I18n target="Publish all" />
                        </button>
                    </li>
                    <li className={publishRelatedItemClassName}>
                        <button onClick={this.onDiscardClick.bind(this)} {...publishRelatedItemAttributes}>
                            <Icon icon="ban" />
                            <I18n target="Discard" />
                        </button>
                    </li>
                    <li className={publishRelatedItemClassName}>
                        <button onClick={this.onDiscardAllClick.bind(this)} {...publishRelatedItemAttributes}>
                            <Icon icon="ban" />
                            <I18n target="Discard all" />
                        </button>
                    </li>
                    <li className={style.dropDown__contents__item}>
                        <label>
                            <input type="checkbox" onChange={this.onAutoPublishChange.bind(this)} />
                            <I18n target="Auto-Publish" />
                        </label>
                    </li>
                    <li className={style.dropDown__contents__item}>
                        <a href="http://neos.h-hotels.com/neos/management/workspaces">
                            <Icon icon="th-large" />
                            <I18n target="Workspaces" />
                        </a>
                    </li>
                </DropDown>
            </div>
        );
    }

    onPublishClick(e) {
        e.preventDefault();

        console.log('publish changes');
    }

    onPublishAllClick(e) {
        e.preventDefault();

        console.log('publish changes');
    }

    onDiscardClick(e) {
        e.preventDefault();

        console.log('discard changes');
    }

    onDiscardAllClick(e) {
        e.preventDefault();

        console.log('discard all changes');
    }

    onAutoPublishChange(e) {
        console.log('auto publish changed', e);
    }
}
