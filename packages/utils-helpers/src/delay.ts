//
// Provides a promise that resolves after
// timeInMilliseconds milliseconds
//
// ToDo: We could use `redux-saga`'s delay function instead of writing our own implementation.
//
export default function delay(timeInMilliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, timeInMilliseconds));
}
