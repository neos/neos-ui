import manifest, {SynchronousRegistry as LegacySynchronousRegistry} from '@neos-project/neos-ui-extensibility';
import {getConfiguration, getFrontendConfigurationForPackage} from '@neos-project/neos-ui-configuration';
import {getGlobalRegistry, getRegistryById, SynchronousRegistry} from "@neos-project/neos-ui-registry";

export let manifestInvocations = 0;

export const globalFrontendConfigurationAccess = getFrontendConfigurationForPackage('@neos-project/neos-ui-test-plugin');

export let legacyFrontendConfigurationAccess: any;

export const globalConfigurationAccess = `loadingDepth type ${typeof getConfiguration(configuration => configuration.nodeTree.loadingDepth)}`;

export let legacyConfigurationAccess: string | undefined;

export const globalGlobalRegistryAccess = `global registry type ${typeof getGlobalRegistry()} { get: ${typeof getGlobalRegistry().get}, set: ${typeof getGlobalRegistry().set} }`;

export let legacyGlobalRegistryAccess: string | undefined;

export function getPluginRegistryValue() {
    return getRegistryById('@neos-project/neos-ui-test-plugin-registry').get('someKey');
}

export function getPluginLegacyRegistryValue() {
    return getRegistryById('@neos-project/neos-ui-test-plugin-legacy-registry').get('someKey');
}

manifest('@neos-project/neos-ui-test-plugin', {}, (globalRegistry, {frontendConfiguration, configuration}) => {
    manifestInvocations++;
    legacyGlobalRegistryAccess = `global registry type ${typeof globalRegistry} { get: ${typeof globalRegistry.get}, set: ${typeof globalRegistry.set} }`;

    legacyFrontendConfigurationAccess = frontendConfiguration['@neos-project/neos-ui-test-plugin'];
    legacyConfigurationAccess = `loadingDepth type ${typeof configuration.nodeTree.loadingDepth}`;

    const myCustomRegistry = new SynchronousRegistry<string>('My registry');
    globalRegistry.set('@neos-project/neos-ui-test-plugin-registry', myCustomRegistry);

    myCustomRegistry.set('someKey', 'some value from my registry');

    const legacyMyCustomRegistry = new LegacySynchronousRegistry<string>('My legacy registry');
    globalRegistry.set('@neos-project/neos-ui-test-plugin-legacy-registry', legacyMyCustomRegistry);

    legacyMyCustomRegistry.set('someKey', 'some value from my legacy registry');
});
