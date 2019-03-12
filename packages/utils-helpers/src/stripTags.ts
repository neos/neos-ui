const stripTags = (value: string) : string => value.replace(/<\/?[^>]+(>|$)/g, '');
const stripTagsEncoded = (value: string) : string => value.replace(/&lt;\/?[^&gt;]+(&gt;|$)/g, '');

export {stripTags, stripTagsEncoded};
