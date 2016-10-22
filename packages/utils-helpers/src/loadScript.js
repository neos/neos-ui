const scriptCache = [];

export default function loadScript(src) {
    if (scriptCache.indexOf(src) === -1) {
        const script = document.createElement('script');
        script.src = src;
        document.getElementsByTagName('head')[0].appendChild(script);

        scriptCache.push(src);
    }
}
