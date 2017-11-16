const scriptCache = [];

export default function loadScript(src, doc = document) {
    if (scriptCache.indexOf(src) === -1) {
        const script = doc.createElement('script');
        script.src = src;
        doc.getElementsByTagName('head')[0].appendChild(script);

        scriptCache.push(src);
    }
}
