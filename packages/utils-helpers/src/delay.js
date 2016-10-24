//
// Provides a promise that resolves after
// timeInMilliseconds milliseconds
//
export default function delay(timeInMilliseconds) {
    return new Promise(resolve => setTimeout(resolve, timeInMilliseconds));
}
