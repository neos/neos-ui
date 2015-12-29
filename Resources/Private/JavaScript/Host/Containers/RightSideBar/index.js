import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SideBar, Tabs, Panel} from '../../Components/';
import style from './style.css';

@connect()
export default class LeftSideBar extends Component {
    render() {
        return (
            <SideBar position="right" className={style.rightSideBar}>
                <Tabs>
                    <Panel icon="pencil">
                        <h2>Content #1 here</h2>
                    </Panel>
                    <Panel icon="cog">
                        <h2>Content #2 here</h2>
                    </Panel>
                    <Panel icon="bullseye">
                        <h2>Content #3 here</h2>
                    </Panel>
                </Tabs>
            </SideBar>
        );
    }
}
