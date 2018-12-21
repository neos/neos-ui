const isUri = (uri: any) => {
    const trimedUri = String(uri).trim();
    return trimedUri === '' ? false : Boolean(trimedUri.match('^(https?://|news://|ftp://|mailto:|tel:|#)'));
};

export {isUri};
