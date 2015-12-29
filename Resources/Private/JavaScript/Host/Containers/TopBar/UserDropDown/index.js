import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {Icon, I18n} from './../../../Components/';
import style from './style.css';

@connect()
export default class UserDropDown extends Component {
    static propTypes = {
        currentUserName: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {isOpened: false};
    }

    render() {
        const {currentUserName} = this.props;
        const {isOpened} = this.state;
        const arrowIconName = isOpened ? 'chevron-up' : 'chevron-down';
        const dropDownClassName = mergeClassNames({
            [style.dropDown]: true,
            [style.dopDownVisible]: isOpened
        });

        return (
          <div>
              <button href="#" className={style.btn} onClick={this.onClick.bind(this)} onBlur={() => this.onBlur()}>
                  <Icon icon="user" className={style.userIcon} />
                  {currentUserName}

                  <Icon icon={arrowIconName} className={style.arrowIcon} />
              </button>
              <ul className={dropDownClassName}>
                  <li className={`${style.logoutItem} ${style.dropDownItem}`}>
                      <form title="Logout" action="/neos/logout" method="post">
                          <button type="submit" name="" value="logout">
                              <Icon icon="power-off" className={style.dropDownItemIcon} />
                              <I18n target="Logout" />
                          </button>
                      </form>
                    </li>
                    <li className={`${style.userSettingsItem} ${style.dropDownItem}`}>
                        <a title="User Settings" href="http://neos.h-hotels.com/neos/user/usersettings">
                            <Icon icon="wrench" className={style.dropDownItemIcon} />
                            <I18n target="User Settings" />
                        </a>
                    </li>
              </ul>
          </div>
        );
    }

    onClick(e) {
        e.preventDefault();

        this.setState({isOpened: !this.state.isOpened});
    }

    onBlur() {
        this.setState({isOpened: false});
    }
}
