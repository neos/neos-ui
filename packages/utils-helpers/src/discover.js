//
// Turns a generator function into a promise,
// helpful to encapsulate side effects
//
const handle = (generator, result) => {
    if (result.done) {
        return Promise.resolve(result.value);
    }
    return Promise.resolve(result.value).then(
        res => handle(generator, generator.next(res)),
        err => handle(generator, generator.throw(err))
    );
};

export default function discover(generatorFn) {
    return new Promise((resolve, reject) => {
        const generator = generatorFn();

        try {
            resolve(handle(generator, generator.next()));
        } catch (ex) {
            reject(ex);
        }
    });
}
