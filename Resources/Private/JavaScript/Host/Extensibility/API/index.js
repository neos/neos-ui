import API from './api/index';

//
// Export API
//
export default API;

//
// Export runtime dependencies
//
const {
    Components,
    I18n,
    SecondaryInspector,
    api
} = API['@Neos:RuntimeDependencies'];

export {
    Components,
    I18n,
    SecondaryInspector,
    api
};
