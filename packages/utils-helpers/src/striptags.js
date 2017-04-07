const striptags = string => string.replace(/<\/?[^>]+(>|$)/g, '');

export default striptags;
