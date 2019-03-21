import {randomizeString} from './randomizeString';

test(`Expect randomized empty string to be also empty`, () => {
    const baseString = '';
    const randomizedBaseString = randomizeString(baseString);
    expect(baseString).toBe(randomizedBaseString);
});

test(`Expect that the randomized string is different to baseString`, () => {
    const baseString = 'randomizeMe';
    const randomizedBaseString = randomizeString(baseString);
    expect(baseString).not.toBe(randomizedBaseString);
});

test(`Expect that two randomized string are different`, () => {
    const baseString = 'randomizeMe';
    const randomizedBaseString = randomizeString(baseString);
    const secondRandomizedBaseString = randomizeString(baseString);
    expect(randomizedBaseString).not.toBe(secondRandomizedBaseString);
});
