import React from 'react';
import * as Components from 'Components/index';
import * as plow from 'plow-js';
import * as Immutable from 'immutable';
import {I18n} from 'Host/Containers/index';
import Manifest from './Manifest/index';
import * as ApiEndpoints from 'API/Endpoints/index';

const createReadOnlyValue = value => ({
    value,
    writable: false,
    enumerable: false,
    configurable: false
});

export default function apiDefinitionFactory() {
    const api = {
        React,
        Components,
        I18n,
        Manifest,
        plow,
        Immutable,
        ApiEndpoints
    }

    console.log("AAA");

    Object.defineProperty(window, '@Neos:HostPluginAPI', createReadOnlyValue(api));
};
