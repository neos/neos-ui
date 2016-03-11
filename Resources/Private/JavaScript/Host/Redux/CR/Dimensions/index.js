//
// Export the initial state
//
//
export const initialState =[
    {
        presets: [
            {value: 'de', label: 'Deutschland'},
            {value: 'en', label: 'England'},
        ],
        default: 'de',
        defautPReset: 'intl',
        label: 'Country'
    },
    {
        presets: [
            {value: 'intl', label: 'International'},
            {value: 'en', label: 'English'},
        ],
        default: 'intl',
        defautPReset: 'intl',
        label: 'Sprache'
    }
];
export const tempState = [
    {
        country: {
            default: 'intl',
            defaultPreset: 'intl',
            label: 'Country',
            icon: 'icon-language',
            presets: [
                {value: 'one', label: 'One'},
                {value: 'two', label: 'Two'}
            ]
        }
    },
    {
        language: {
            default: 'en_US',
            defaultPreset: 'en_US',
            label: 'Language',
            icon: 'icon-language',
            presets: {
                de_DE: {
                    label: 'Deutsch',
                    values: ['de_DE'],
                    uriSegment: 'de'
                },
                en_US: {
                    label: 'English US',
                    values: ['en_US'],
                    uriSegment: 'en'
                },
                en_UK: {
                    label: 'English UK',
                    values: ['en_UK']
                }
            }
        }
    }
];

//
// Export the reducer
//
export const reducer = {

};
