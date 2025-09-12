
// @ts-ignore
import { systemEnv as systemEnvOriginal } from './src/System';

/**
 * Access to the global system env.
 *
 * FIXME
 * The configuration is residing in @neos-project/neos-ui where technically no package has a dependency on (as it should) a future refactoring should tackle this.
 */
export const systemEnv: string = systemEnvOriginal;

export function isDevelopmentContext(): boolean {
    return systemEnv === 'Development' || systemEnv.startsWith('Development/')
}
