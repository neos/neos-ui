
/**
 * Definition which exports should be bundled
 *
 * This module must be used async to avoid big bundle size
 *
 *     asyncModule = usePromise(() => import('./libphonenumber'), []);
 *
 */
export {parsePhoneNumber, AsYouType, getCountries, getCountryCallingCode} from 'libphonenumber-js/min';
