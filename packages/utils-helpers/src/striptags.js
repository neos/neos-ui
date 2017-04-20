const striptags = string => string.replace(/<\/?[^>]+(>|$)/g, '');
const striptagsEncoded = string => string.replace(/&lt;\/?[^&gt;]+(&gt;|$)/g, '');

export {striptags, striptagsEncoded};
