const stripTags = string => string.replace(/<\/?[^>]+(>|$)/g, '');
const stripTagsEncoded = string => string.replace(/&lt;\/?[^&gt;]+(&gt;|$)/g, '');

export {stripTags, stripTagsEncoded};
