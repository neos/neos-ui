import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SideBar, Tabs, Panel, IconButton, TextInput, ToggablePanel} from '../../Components/';
import style from './style.css';

@connect()
export default class LeftSideBar extends Component {
    render() {
        return (
            <SideBar position="right" className={style.rightSideBar}>
                <Tabs>
                    <Panel icon="pencil">
                        <ToggablePanel title="My fancy configuration">
                            <TextInput
                                label="Title"
                                placeholder="Type to search"
                                />
                        </ToggablePanel>

                    </Panel>
                    <Panel icon="cog">
                        <p>Content #2 here</p>
                    </Panel>
                    <Panel icon="bullseye">
                        <p>Content #3 here</p>
                    </Panel>
                </Tabs>

                <IconButton icon="chevron-right" className={style.rightSideBar__toggleBtn} onClick={this.toggleSidebar.bind(this)} />
            </SideBar>
        );
    }

    toggleSidebar() {
        console.log('Toggle right sidebar');
    }
}
