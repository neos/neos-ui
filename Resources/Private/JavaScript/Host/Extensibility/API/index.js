import API from './api/index';

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

//
// Export API
//
export default API;
