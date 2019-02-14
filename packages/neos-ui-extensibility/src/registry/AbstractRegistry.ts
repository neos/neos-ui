export default class AbstractRegistry {
    public SERIAL_VERSION_UID = 'd8a5aa78-978e-11e6-ae22-56b6b6499611';
    public description: string;

    constructor(description: string) {
        // The description of the registry, containing examples, what is in there.
        this.description = description;
    }
}
