import isThenable from './isThenable';

//
// Turns a generator function into a promise,
// helpful to encapsulate side effects
//
export default function discover(generatorFn) {
    return new Promise((resolve, reject) => {
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
}
