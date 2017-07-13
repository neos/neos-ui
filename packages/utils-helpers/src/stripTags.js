const stripTags = string => string && string.replace(/<\/?[^>]+(>|$)/g, '');
const stripTagsEncoded = string => string && string.replace(/&lt;\/?[^&gt;]+(&gt;|$)/g, '');

export {stripTags, stripTagsEncoded};
