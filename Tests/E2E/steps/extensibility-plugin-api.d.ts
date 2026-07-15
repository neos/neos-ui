import type {NeosUiTestPlugin} from '@neos-project/neos-ui-test-plugin';

/**
 * Separate declaration file to enhance writing tests. We must not actually import the neos-ui-test-plugin as the test runner should not have a real dependency to that. These are just considered hints.
 */
declare global {
    interface Window {
        neosUiTestPlugin: NeosUiTestPlugin
    }
}
