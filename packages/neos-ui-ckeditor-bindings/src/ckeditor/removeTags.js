/* eslint babel/new-cap: 0 */
export default (text, CKEDITOR) => {
    // 2) apply content filtering *with an empty filter rule set*; this will strip out:
    //    - all attributes
    //    - most tags (such as "b")
    // For some reason, it does not strip out <p> Tags; not sure why...
    const filterRules = {};
    const filter = new CKEDITOR.filter(filterRules);
    const fragment = CKEDITOR.htmlParser.fragment.fromHtml(text);
    const writer = new CKEDITOR.htmlParser.basicWriter();
    filter.applyTo(fragment);
    fragment.writeHtml(writer);
    text = writer.getHtml();

    // 3) that's why we finally remove all remaining (opening and closing) tags with a regex.
    return text.replace(/<\/?[a-z0-9A-Z]+[^>]*>/g, '');
};
