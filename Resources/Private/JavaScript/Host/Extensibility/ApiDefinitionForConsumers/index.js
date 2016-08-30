import {I18n} from 'Host/Containers/index';
import manifest from './Manifest/index';
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
        I18n,
        manifest,
        ApiEndpoints,
        SecondaryInspector
    };

    Object.defineProperty(window, '@Neos:HostPluginAPI', createReadOnlyValue(api));
}
