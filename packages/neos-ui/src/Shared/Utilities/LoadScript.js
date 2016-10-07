const scriptCache = [];

function loadScriptInternal(src) {
    const script = document.createElement('script');
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);
}

export default function load(src) {
    if (scriptCache.indexOf(src) === -1) {
        loadScriptInternal(src);
        scriptCache.push(src);
    }
}
