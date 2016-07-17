import React from 'react';
import * as Components from 'Components/index';
import {I18n} from 'Host/Containers/index';
import SecondaryInspector from 'Host/Containers/RightSideBar/Inspector/Secondary/index';

export default (api) => ({
    React,
    Components,
    I18n,
    SecondaryInspector,
    api
});
