import API from '@host/api/index';



const {_ReactDOM} = API['@Neos:RuntimeDependencies'];

console.log("getting React DOM", API, _ReactDOM);

export default _ReactDOM;
