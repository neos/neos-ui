//
// Turns a generator function into a promise,
// helpful to encapsulate side effects
//
const handle = (generator: Generator, result: any): Promise<any> => {
    if (result.done) {
        return Promise.resolve(result.value);
    }
    return Promise.resolve(result.value).then(
        res => handle(generator, generator.next(res)),
        err => handle(generator, generator.throw && generator.throw(err))
    );
};

export default function discover(generatorFn: GeneratorFunction): Promise<any> {
    return new Promise((resolve, reject) => {
        const generator = generatorFn();

        try {
            resolve(handle(generator, generator.next()));
        } catch (ex) {
            reject(ex);
        }
    });
}
