import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import Immutable from 'immutable';
import {I18n, Icon} from '../../../Components/';
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
        const publishBtnAttributes = {
            className: mergeClassNames({
                [style.btn]: true,
                [style['btn--publishBtn']]: true,
                [style['btn--disabled']]: !isPublishable,
                [style['btn--isSaving']]: false
            }),
            onClick: this.onPublishClick.bind(this)
        };
        const dropDownBtnAttributes = {
            className: mergeClassNames({
                [style.btn]: true,
                [style['btn--disabled']]: !isPublishable
            }),
            onClick: this.onDropDownToggle.bind(this)
        };

        if (!isPublishable) {
            publishBtnAttributes.disabled = 'disabled';
            dropDownBtnAttributes.disabled = 'disabled';
        }

        return (
            <div className={style.wrapper}>
                <button {...publishBtnAttributes}>
                  Published
                </button>
                <button {...dropDownBtnAttributes}>
                    <Icon icon="chevron-down" />
                </button>
                <ul className={style.dropDown}>
                    <li>
                        <button onClick={this.onPublishAllClick.bind(this)}>
                            <Icon icon="upload" />
                            <I18n target="Publish all" />
                        </button>
                    </li>
                    <li>
                        <button onClick={this.onDiscardClick.bind(this)}>
                            <Icon icon="ban" />
                            <I18n target="Discard" />
                        </button>
                    </li>
                    <li>
                        <button onClick={this.onDiscardAllClick.bind(this)}>
                            <Icon icon="ban" />
                            <I18n target="Discard all" />
                        </button>
                    </li>
                    <li>
                        <label>
                            <input type="checkbox" onChange={this.onAutoPublishChange.bind(this)} />
                            <I18n target="Auto-Publish" />
                        </label>
                    </li>
                    <li>
                        <a href="http://neos.h-hotels.com/neos/management/workspaces">
                            <Icon icon="th-large" />
                            <I18n target="Workspaces" />
                        </a>
                    </li>
                </ul>
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

    onDropDownToggle(e) {
        e.preventDefault();

        console.log('open publish dropdown');
    }

    onAutoPublishChange(e) {
        console.log('auto publish changed', e);
    }
}
