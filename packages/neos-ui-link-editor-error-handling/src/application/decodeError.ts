export function decodeError(error: string | Error) {
    if (error instanceof Error) {
        error.message = decodeErrorMessage(error.message);
        return error;
    } else {
        return new Error(decodeErrorMessage(error));
    }
}

function decodeErrorMessage(errorMessage: string) {
    if (errorMessage.includes('<!DOCTYPE html>')) {
        const dom = new DOMParser().parseFromString(
            errorMessage,
            'text/html'
        );

        return  `[${dom.title}] ${dom.querySelector('h1')?.innerText}`;
    }

    return errorMessage;
}