import React, {PropTypes} from 'react';

import {Tabs, ToggablePanel, Label, TextInput} from 'Host/Components/';

import style from '../../style.css';

const TabPanel = props => {
        return (<Tabs.Panel>
        <ToggablePanel className={style.rightSideBar__section}>
            <ToggablePanel.Header>
                My fancy configuration
            </ToggablePanel.Header>
            <ToggablePanel.Contents>
                <Label htmlFor="testInput">
                    Title
                </Label>
                <TextInput placeholder="Type to search" id="testInput" />
            </ToggablePanel.Contents>
        </ToggablePanel>
    </Tabs.Panel>);
};
TabPanel.displayName = 'Inspector Tab Panel';
TabPanel.propTypes = {
    tab: PropTypes.object.isRequired,
    focusedNode: PropTypes.object.isRequired
};

export default TabPanel;
