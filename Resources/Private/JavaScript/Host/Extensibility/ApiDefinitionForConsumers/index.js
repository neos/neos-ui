import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import * as plow from 'plow-js';
import * as Immutable from 'immutable';
import * as reactRedux from 'react-redux';
import {I18n} from 'Host/Containers/index';
import Manifest from './Manifest/index';
import * as ApiEndpoints from 'API/Endpoints/index';
import SecondaryInspector from 'Host/Containers/RightSideBar/Inspector/SecondaryInspector/index';

const createReadOnlyValue = value => ({
    value,
    writable: false,
    enumerable: false,
    configurable: false
});

export default function apiDefinitionFactory() {
    const api = {
        React,
        I18n,
        Manifest,
        plow,
        Immutable,
        ApiEndpoints,
        reactRedux,
        SecondaryInspector,
        shallowCompare
    };

    Object.defineProperty(window, '@Neos:HostPluginAPI', createReadOnlyValue(api));
}
