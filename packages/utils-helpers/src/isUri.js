const isUri = uri => {
  const trimedUri = String(uri).trim();
  return trimedUri === '' ? false : Boolean(trimedUri.match('^(https?://|news://|ftp://|mailto:|tel:|#)'));
};

export {isUri};
