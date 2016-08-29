import React from 'react';
import * as plow from 'plow-js';
import * as Immutable from 'immutable';
import * as reactRedux from 'react-redux';
import {I18n} from 'Host/Containers/index';
import Manifest from './Manifest/index';
import * as ApiEndpoints from 'API/Endpoints/index';
import SecondaryInspector from 'Host/Containers/RightSideBar/Inspector/SecondaryInspector/index';

import Bar from '@neos-project/react-ui-components/lib/Bar/';
import Button from '@neos-project/react-ui-components/lib/Button/';
import CheckBox from '@neos-project/react-ui-components/lib/CheckBox/';
import Dialog from '@neos-project/react-ui-components/lib/Dialog/';
import DropDown from '@neos-project/react-ui-components/lib/DropDown/';
import Frame from '@neos-project/react-ui-components/lib/Frame/';
import Grid from '@neos-project/react-ui-components/lib/Grid/';
import Headline from '@neos-project/react-ui-components/lib/Headline/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import IconButtonDropDown from '@neos-project/react-ui-components/lib/IconButtonDropDown/';
import Label from '@neos-project/react-ui-components/lib/Label/';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import SideBar from '@neos-project/react-ui-components/lib/SideBar/';
import TextArea from '@neos-project/react-ui-components/lib/TextArea/';
import TextInput from '@neos-project/react-ui-components/lib/TextInput/';
import ToggablePanel from '@neos-project/react-ui-components/lib/ToggablePanel/';
import Tree from '@neos-project/react-ui-components/lib/Tree/';


const createReadOnlyValue = value => ({
    value,
    writable: false,
    enumerable: false,
    configurable: false
});

export default function apiDefinitionFactory() {
    const api = {
        React,
        Components: {
            Bar,
            Button,
            CheckBox,
            Dialog,
            DropDown,
            Frame,
            Grid,
            Headline,
            Icon,
            IconButton,
            IconButtonDropDown,
            Label,
            SelectBox,
            SideBar,
            TextArea,
            TextInput,
            ToggablePanel,
            Tree
        },
        I18n,
        Manifest,
        plow,
        Immutable,
        ApiEndpoints,
        reactRedux,
        SecondaryInspector
    };

    Object.defineProperty(window, '@Neos:HostPluginAPI', createReadOnlyValue(api));
};
