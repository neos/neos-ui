import API from '@host/api/index';

const {Components} = API['@Neos:RuntimeDependencies'];

console.log("COMPONENTS LOADED IN GUEST");

module.exports = Components;
