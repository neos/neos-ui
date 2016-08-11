import React from 'react';
import * as Components from 'Components/index';
import {I18n} from 'Host/Containers/index';
import Manifest from './Manifest/index';

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
        Manifest
    }

    console.log("AAA");

    Object.defineProperty(window, '@Neos:HostPluginAPI', createReadOnlyValue(api));
};
