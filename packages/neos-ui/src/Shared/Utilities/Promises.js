//
// Determines whether a value is a thenable
//
export const isThenable = maybePromise => typeof maybePromise === 'object' && typeof maybePromise.then === 'function';

//
// Provides a promise that resolves after
// ms milliseconds
//
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//
// Turns a generator function into a promise,
// helpful to encapsulate side effects
//
export const discover = generatorFn => new Promise((resolve, reject) => {
    const generator = generatorFn();
    const handle = result => {
        if (result.done) {
            return isThenable(result.value) ? result.value : Promise.resolve(result.value);
        }
        return Promise.resolve(result.value).then(
            res => handle(generator.next(res)),
            err => handle(generator.throw(err))
        );
    };

    try {
        resolve(handle(generator.next()));
    } catch (ex) {
        reject(ex);
    }
});
