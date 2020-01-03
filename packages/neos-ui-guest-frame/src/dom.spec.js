import {clampElementToDocumentDimensions} from './dom';

const documentDimensions = {
    top: 0,
    height: 5,
    bottom: 5,

    left: 0,
    width: 5,
    right: 5
};

test(`no clamping because element is fully in document `, () => {
    /**
     *  ┌────────┐
     *  │ ┌───┐  │
     *  │ │   │  │
     *  │ │   │  │
     *  │ └───┘  │
     *  └────────┘
     */
    const elementDimensions = {
        top: 1,
        height: 3,
        bottom: 4,

        left: 1,
        width: 2,
        right: 3
    };

    const actual = clampElementToDocumentDimensions(elementDimensions, documentDimensions);
    expect(actual).toEqual({
        ...elementDimensions,
        rightAsMeasuredFromRightDocumentBorder: 2
    });
});

describe('X Axis overflows', () => {
    test(`clamping because element is moved partially outside viewport to right; should shrink dimensions of element`, () => {
        /**
         *  ┌────────┐
         *  │      ┌─┼─┐
         *  │      │ │ │
         *  │      │ │ │
         *  │      └─┼─┘
         *  └────────┘
         */

        const elementDimensions = {
            top: 1,
            height: 3,
            bottom: 4,

            left: 4,
            width: 2,
            right: 6
        };

        const actual = clampElementToDocumentDimensions(elementDimensions, documentDimensions);
        expect(actual).toEqual({
            ...elementDimensions,
            width: 1,
            right: 5,
            rightAsMeasuredFromRightDocumentBorder: 0
        });
    });

    test(`clamping because element is moved fully outside viewport to right; should shrink dimensions of element to 0 px`, () => {
        /**
         * ┌────────┐
         * │        │┌───┐
         * │        ││   │
         * │        ││   │
         * │        │└───┘
         * └────────┘
         */

        const elementDimensions = {
            top: 1,
            height: 3,
            bottom: 4,

            left: 6,
            width: 2,
            right: 8
        };

        const actual = clampElementToDocumentDimensions(elementDimensions, documentDimensions);
        expect(actual).toEqual({
            ...elementDimensions,
            left: 5,
            width: 0,
            right: 5,
            rightAsMeasuredFromRightDocumentBorder: 0
        });
    });

    test(`clamping because element is moved partially outside viewport to left; should shrink dimensions`, () => {
        /**
         *   ┌────────┐
         * ┌─┼─┐      │
         * │ │ │      │
         * │ │ │      │
         * └─┼─┘      │
         *   └────────┘
         */

        const elementDimensions = {
            top: 1,
            height: 3,
            bottom: 4,

            left: -1,
            width: 2,
            right: 1
        };

        const actual = clampElementToDocumentDimensions(elementDimensions, documentDimensions);
        expect(actual).toEqual({
            ...elementDimensions,
            left: 0,
            width: 1,
            rightAsMeasuredFromRightDocumentBorder: 4
        });
    });

    test(`clamping because element is moved fully outside viewport to left; should shrink dimensions of element to 0 px`, () => {
        /**
         *      ┌────────┐
         * ┌───┐│        │
         * │   ││        │
         * │   ││        │
         * └───┘│        │
         *      └────────┘
         */
        const elementDimensions = {
            top: 1,
            height: 3,
            bottom: 4,

            left: -3,
            width: 2,
            right: -1
        };

        const actual = clampElementToDocumentDimensions(elementDimensions, documentDimensions);
        expect(actual).toEqual({
            ...elementDimensions,
            left: 0,
            width: 0,
            right: 0,
            rightAsMeasuredFromRightDocumentBorder: 5
        });
    });
});

describe('Y Axis overflows', () => {
    test(`clamping because element is moved partially outside viewport to bottom; should shrink dimensions of element`, () => {
        /**
         * ┌────────┐
         * │        │
         * │        │
         * │ ┌───┐  │
         * │ │   │  │
         * └─┼───┼──┘
         *   └───┘
         */

        const elementDimensions = {
            top: 4,
            height: 2,
            bottom: 6,

            left: 1,
            width: 2,
            right: 3
        };

        const actual = clampElementToDocumentDimensions(elementDimensions, documentDimensions);
        expect(actual).toEqual({
            ...elementDimensions,
            rightAsMeasuredFromRightDocumentBorder: 2,

            height: 1,
            bottom: 5
        });
    });

    test(`clamping because element is moved fully outside viewport to bottom; should shrink dimensions of element to 0 px`, () => {
        /**
         * ┌────────┐
         * │        │
         * │        │
         * │        │
         * │        │
         * └────────┘
         *   ┌───┐
         *   │   │
         *   │   │
         *   └───┘
         */

        const elementDimensions = {
            top: 6,
            height: 2,
            bottom: 8,

            left: 1,
            width: 2,
            right: 3
        };

        const actual = clampElementToDocumentDimensions(elementDimensions, documentDimensions);
        expect(actual).toEqual({
            ...elementDimensions,
            rightAsMeasuredFromRightDocumentBorder: 2,

            top: 5,
            height: 0,
            bottom: 5
        });
    });

    test(`clamping because element is moved partially outside viewport to top; should shrink dimensions of element`, () => {
        /**
         *   ┌───┐
         * ┌─┼───┼──┐
         * │ │   │  │
         * │ └───┘  │
         * │        │
         * │        │
         * └────────┘
         */

        const elementDimensions = {
            top: -1,
            height: 2,
            bottom: 1,

            left: 1,
            width: 2,
            right: 3
        };

        const actual = clampElementToDocumentDimensions(elementDimensions, documentDimensions);
        expect(actual).toEqual({
            ...elementDimensions,
            rightAsMeasuredFromRightDocumentBorder: 2,

            top: 0,
            height: 1
        });
    });

    test(`clamping because element is moved fully outside viewport to top; should shrink dimensions of element to 0 px`, () => {
        /**
         *   ┌───┐
         *   │   │
         *   │   │
         *   └───┘
         * ┌────────┐
         * │        │
         * │        │
         * │        │
         * │        │
         * └────────┘
         */
        const elementDimensions = {
            top: -3,
            height: 2,
            bottom: -1,

            left: 1,
            width: 2,
            right: 3
        };

        const actual = clampElementToDocumentDimensions(elementDimensions, documentDimensions);
        expect(actual).toEqual({
            ...elementDimensions,
            rightAsMeasuredFromRightDocumentBorder: 2,

            top: 0,
            height: 0,
            bottom: 0
        });
    });
});
