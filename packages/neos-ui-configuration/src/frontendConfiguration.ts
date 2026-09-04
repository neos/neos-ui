import {getInlinedDataFromBackend} from './bootstrap';
import {GlobalRegistry, SynchronousRegistry} from '@neos-project/neos-ui-registry';
import {terminateDueToFatalInitializationError} from '@neos-project/neos-ui-error';

const frontendConfiguration = getInlinedDataFromBackend('frontendConfiguration') as Record<string, any>;

if (!frontendConfiguration || typeof frontendConfiguration !== 'object') {
    console.error(frontendConfiguration);
    terminateDueToFatalInitializationError(`Could not initialize as the frontendConfiguration contains an invalid value. ${typeof frontendConfiguration}, Expected object.`);
}

/**
 * Frontend configuration
 *
 * Any setting from Flows configuration 'Neos.Neos.Ui.frontendConfiguration' is available here.
 *
 * API for third party packages to deliver own settings to the UI at boot time.
 * Settings from each package should be prefixed to avoid collisions:
 *
 * Neos:
 *     Neos:
 *         Ui:
 *             frontendConfiguration:
 *                 'Your.Own:Package':
 *                     someKey: someValue
 *
 * Then it may be accessed via {@see getFrontendConfigurationForPackage()}
 */
export function getFrontendConfigurationForPackage(packageKey: string): Record<string, any> | null {
    if (frontendConfiguration && packageKey in frontendConfiguration) {
        return frontendConfiguration[packageKey];
    }
    return null;
}

/**
 * @deprecated For legacy compatibility use getFrontendConfigurationForPackage() instead
 */
export function getFullPackageFrontendConfiguration(): Record<string, any> {
    return frontendConfiguration;
}

/**
 * @deprecated Use `import {getFrontendConfiguration} from '@neos-project/neos-ui-configuration'` instead
 */
const frontendConfigurationRegistry = new SynchronousRegistry(`Frontend configuration registry`);

/**
 * @internal
 */
export function initializeFrontendConfiguration(globalRegistry: GlobalRegistry) {
    globalRegistry.set('frontendConfiguration', frontendConfigurationRegistry);

    Object.entries(frontendConfiguration).forEach(([key, value]) => {
        frontendConfigurationRegistry.set(key, {
            ...value
        });
    });
}
