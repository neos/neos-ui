import manifest from 'Host/Extensibility/API/Manifest/index';
console.log("AA", manifest);
manifest('inspectorEditors', (registry) => {
    console.log("Manifest inspector editors");
});
