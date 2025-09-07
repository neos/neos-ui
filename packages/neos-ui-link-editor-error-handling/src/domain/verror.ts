
/**
 * Custom error class with chains of causes
 */
export class VError extends Error {
    constructor(
        message: string,
        private readonly previous: Error | undefined = undefined
    ) {
        super(message);
    };

    public cause(): Error | undefined {
        return this.previous;
    }
}
